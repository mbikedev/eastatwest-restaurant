"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/context/ThemeContext";
import Image from "next/image";
// Note: Using select elements for time picking instead of heavy react-time-picker library
import { supabase } from '@/lib/supabaseClient';
import { checkSupabaseConfig, debugSupabaseConfig } from '@/lib/envCheck';
import toast from 'react-hot-toast';
import {
  ReservationValidator,
  type ValidationError
} from '@/utils/reservationValidation';
import { Holiday } from '@/types/holidays';
import { isDateInHolidayRange } from '@/lib/holidayUtils';

// Type for slot availability data from the API
interface SlotAvailability {
  totalGuests: number;
  remainingCapacity: number;
  isFull: boolean;
  reservations: { id: string; name: string; guests: number; start_time: string; end_time: string }[];
}
function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

// Helper function to send reservation email via API
async function sendReservationEmail({ email, guests, language, invoiceNumber, reservationData }: {
  email: string,
  guests: number,
  language: string,
  invoiceNumber?: string,
  reservationData: {
    name: string;
    email: string;
    phone: string;
    date: string;
    startTime: string;
    endTime: string;
    guests: number;
    specialRequests: string;
  }
}) {
  try {
    const response = await fetch('/api/send-reservation-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, guests, language, invoiceNumber, reservationData }),
    });

    const result = await response.json();
    
    if (!result.success) {
      console.error('Failed to send email:', result.error);
    }
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

// Helper function to send notification emails to restaurant staff
async function sendNotificationEmails({ reservationData }: {
  reservationData: {
    name: string;
    email: string;
    phone: string;
    date: string;
    startTime: string;
    endTime: string;
    guests: number;
    specialRequests: string;
  }
}) {
  try {
    console.log('Attempting to send notification emails...', { reservationData });
    const response = await fetch('/api/send-notification-emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ reservationData }),
    });

    console.log('Notification email API response status:', response.status);
    const result = await response.json();
    console.log('Notification email API result:', result);

    if (!result.success) {
      console.error('❌ Failed to send notification emails:', result.error);
      // Show user-facing error
      toast.error('Warning: Staff notification may not have been sent. Please call the restaurant to confirm your reservation.');
    } else {
      console.log('✅ Notification emails sent successfully:', result.message);
    }

    return result;
  } catch (error) {
    console.error('❌ Error sending notification emails:', error);
    toast.error('Warning: Staff notification may not have been sent. Please call the restaurant to confirm your reservation.');
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export default function ReservationsPage() {
  const { t, i18n } = useTranslation("common");
  const { theme } = useTheme();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    startTime: "",
    endTime: "",
    guests: "",
    specialRequests: "",
    date: "",
  });
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [validationWarnings, setValidationWarnings] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [showClosureModal, setShowClosureModal] = useState(false);
  const [currentClosureHoliday, setCurrentClosureHoliday] = useState<Holiday | null>(null);
  const [slotAvailability, setSlotAvailability] = useState<Record<string, SlotAvailability>>({});
  const [loadingAvailability, setLoadingAvailability] = useState(false);
  const [availabilityError, setAvailabilityError] = useState(false);
  const today = useMemo(() => new Date(), []);
  const [calendar, setCalendar] = useState({
    year: today.getFullYear(),
    month: today.getMonth(),
  });

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Add canonical link and JSON-LD schema for SEO
  useEffect(() => {
    // Add canonical link
    const canonicalLink = document.querySelector('link[rel="canonical"]') || document.createElement('link');
    canonicalLink.setAttribute('rel', 'canonical');
    canonicalLink.setAttribute('href', 'https://eastatwest.com/reservations');
    if (!document.querySelector('link[rel="canonical"]')) {
      document.head.appendChild(canonicalLink);
    }

    // Add JSON-LD schema
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Restaurant',
      name: 'East @ West',
      url: 'https://eastatwest.com/',
      acceptsReservations: 'https://eastatwest.com/reservations',
      telephone: '+32 465 20 60 24',
      address: {
        '@type': 'PostalAddress',
        streetAddress: "Boulevard de l'Empereur 26",
        addressLocality: 'Brussels',
        postalCode: '1000',
        addressCountry: 'BE',
      },
      servesCuisine: 'Lebanese',
      priceRange: '€€',
    });
    document.head.appendChild(script);

    // Cleanup
    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  // Fetch active holidays on mount and determine if closure modal should show
  useEffect(() => {
    const fetchHolidays = async () => {
      try {
        const response = await fetch('/api/holidays/active');
        const result = await response.json();

        if (result.success && result.data) {
          setHolidays(result.data);
          console.log(`📅 Loaded ${result.data.length} active holidays for calendar`);

          // Find current or upcoming holiday closure (within next 30 days)
          const now = new Date();
          const thirtyDaysFromNow = new Date();
          thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

          const relevantHoliday = result.data.find((holiday: Holiday) => {
            const startDate = new Date(holiday.start_date);
            const endDate = new Date(holiday.end_date);

            // Show if holiday hasn't ended yet and starts within next 30 days
            return endDate >= now && startDate <= thirtyDaysFromNow;
          });

          if (relevantHoliday) {
            // Check localStorage to see if user already dismissed this holiday
            const dismissedHolidays = JSON.parse(localStorage.getItem('dismissedHolidayClosures') || '[]');
            const alreadyDismissed = dismissedHolidays.includes(relevantHoliday.id);

            if (!alreadyDismissed) {
              setCurrentClosureHoliday(relevantHoliday);
              setShowClosureModal(true);
              console.log(`🔔 Showing closure modal for holiday: ${relevantHoliday.name}`);
            }
          }
        }
      } catch (error) {
        console.error('Failed to fetch holidays:', error);
        // Don't show error to user - calendar will still work, just without holiday blocking
      }
    };

    fetchHolidays();
  }, []);

  // Fetch slot availability when date changes
  const fetchAvailability = useCallback(async (date: string) => {
    if (!date) return;
    setLoadingAvailability(true);
    setAvailabilityError(false);
    try {
      const response = await fetch(`/api/reservations/availability?date=${date}`);
      const result = await response.json();
      if (result.success && result.slots) {
        setSlotAvailability(result.slots);
      } else {
        setAvailabilityError(true);
      }
    } catch {
      console.error('Failed to fetch availability');
      setAvailabilityError(true);
    } finally {
      setLoadingAvailability(false);
    }
  }, []);

  useEffect(() => {
    if (form.date) {
      fetchAvailability(form.date);
    }
  }, [form.date, fetchAvailability]);

  useEffect(() => {
    setForm((f) => ({ ...f, date: `${calendar.year}-${String(calendar.month + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}` }));
  }, [calendar.year, calendar.month, today]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // If start time changes, clear end time to prevent invalid combinations
    if (name === 'startTime') {
      setForm(prev => ({ ...prev, [name]: value, endTime: '' }));
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // Handle closure modal dismissal
  const handleCloseClosureModal = () => {
    if (currentClosureHoliday) {
      // Save dismissed holiday to localStorage
      const dismissedHolidays = JSON.parse(localStorage.getItem('dismissedHolidayClosures') || '[]');
      if (!dismissedHolidays.includes(currentClosureHoliday.id)) {
        dismissedHolidays.push(currentClosureHoliday.id);
        localStorage.setItem('dismissedHolidayClosures', JSON.stringify(dismissedHolidays));
      }
    }
    setShowClosureModal(false);
  };

  // Format date for display in modal
  const formatModalDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString(i18n.language, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Handle name input - only allow alphabetic characters, spaces, hyphens, and apostrophes
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow letters, spaces, hyphens, and apostrophes
    const filteredValue = value.replace(/[^a-zA-Z\s\-']/g, '');
    setForm(prev => ({ ...prev, name: filteredValue }));
  };

  // Handle phone input - allow only numbers
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d]/g, ''); // Allow only digits
    setForm(prev => ({ ...prev, phone: value }));
  };

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(calendar.year, calendar.month, day);
    // Prevent clicking on Sundays or holidays
    if (clickedDate.getDay() === 0 || isHoliday(clickedDate)) return;
    setForm((prevForm) => ({ ...prevForm, date: `${calendar.year}-${String(calendar.month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}` }));
  };

  const handleMonthChange = (offset: number) => {
    setCalendar((prev) => {
      let newMonth = prev.month + offset;
      let newYear = prev.year;
      if (newMonth < 0) {
        newMonth = 11;
        newYear -= 1;
      } else if (newMonth > 11) {
        newMonth = 0;
        newYear += 1;
      }
      return { year: newYear, month: newMonth };
    });
  };

  // Check if a date is a holiday
  const isHoliday = (date: Date): boolean => {
    return holidays.some(holiday => isDateInHolidayRange(date, holiday));
  };

  // Validation only runs on form submission, not on every keystroke

  const getFieldError = (fieldName: string): string | undefined => {
    return validationErrors.find(error => error.field === fieldName)?.message;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Debug Supabase configuration
    debugSupabaseConfig();

    // Run async validation before submitting (includes holiday check)
    const validationResult = await ReservationValidator.validate(form, t);

    if (!validationResult.isValid) {
      setValidationErrors(validationResult.errors);
      setValidationWarnings(validationResult.warnings);

      // Show first error in toast
      if (validationResult.errors.length > 0) {
        toast.error(validationResult.errors[0].message);
      }
      setIsSubmitting(false);
      return;
    }

    // Check for capacity conflicts and duplicate reservations before submitting
    try {
      if (checkSupabaseConfig()) {
        const requestedGuests = Number(form.guests);

        // Use the availability API to check feasibility
        const feasibilityResponse = await fetch('/api/reservations/availability', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            date: form.date,
            startTime: form.startTime,
            endTime: form.endTime,
            guests: requestedGuests,
          }),
        });

        const feasibility = await feasibilityResponse.json();

        if (feasibility.success && !feasibility.canBook) {
          // Reservation would exceed capacity
          toast.error(
            t('reservations.noMoreReservation') ||
            'No more reservation is possible for this time slot. Please choose a different time.'
          );

          // Show alternative time suggestions (without seat counts)
          if (feasibility.alternatives && feasibility.alternatives.length > 0) {
            const topAlternatives = feasibility.alternatives.slice(0, 3);
            const altText = topAlternatives
              .map((a: { time: string; availableSeats: number }) => a.time)
              .join(', ');
            toast(
              `${t('reservations.alternativeSuggestion') || 'Available alternatives'}: ${altText}`,
              { duration: 6000 }
            );
          }

          // Refresh availability data
          fetchAvailability(form.date);
          setIsSubmitting(false);
          return;
        }

        // Check for duplicate reservation by same email on same date
        const { data: existingReservations, error: existingError } = await supabase
          .from('reservations')
          .select('id, start_time, end_time')
          .eq('email', form.email)
          .eq('date', form.date)
          .neq('status', 'cancelled');

        if (existingError) {
          console.warn('Could not check for existing reservations:', existingError);
        } else if (existingReservations && existingReservations.length > 0) {
          toast.error(t('reservations.alreadyReserved') || 'You already have a reservation on this date. Please contact us to modify your existing reservation.');
          setIsSubmitting(false);
          return;
        }
      }
    } catch (capacityCheckError) {
      console.warn('Error checking for capacity:', capacityCheckError);
      // Continue with submission - don't block the user if capacity check fails
    }
    
    try {
      // Check if Supabase is configured
      if (!checkSupabaseConfig()) {
        console.error('Supabase environment variables not configured');
        toast.error(t('reservations.error') || 'Unable to process reservation. Please contact the restaurant directly.');
        setIsSubmitting(false);
        return;
      }

      // Try to connect to Supabase
      let status = 'confirmed';
      const guest_count = Number(form.guests);
      if (guest_count >= 7 && guest_count <= 22) {
        status = 'pending';
      }

      // Generate invoice number
      const invoiceNumber = `INV-${String(Date.now()).slice(-4)}${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;

      const { error } = await supabase
        .from('reservations')
        .insert({
          name: form.name,
          email: form.email,
          phone: form.phone,
          date: form.date,
          start_time: form.startTime,
          end_time: form.endTime,
          guests: guest_count,
          special_requests: form.specialRequests,
          invoice_number: invoiceNumber,
          status
        });

      if (error) {
        console.error('Supabase error:', error);
        console.error('Error details:', {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint
        });

        // Check for column name errors
        if (error.message?.includes('column') || error.code === '42703') {
          console.error('Column name error detected. Please check your database schema.');
          toast.error('Database configuration error. Please contact support.');
          setIsSubmitting(false);
          return;
        }

        // Show error to user - do NOT send emails if database insert failed
        toast.error(t('reservations.error') || 'Failed to save reservation. Please try again or contact the restaurant directly.');
        setIsSubmitting(false);
        return;
      }

      // SUCCESS - Only send emails after successful database insert
      // Show confirmation message
      toast.success(t('reservations.confirmationMessage'));

      // Save form data before resetting (IMPORTANT: must happen before reset!)
      const reservationData = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        date: form.date,
        startTime: form.startTime,
        endTime: form.endTime,
        guests: guest_count,
        specialRequests: form.specialRequests
      };

      // Send email after reservation
      const language = i18n.language || 'en';
      await sendReservationEmail({
        email: reservationData.email,
        guests: guest_count,
        language,
        invoiceNumber,
        reservationData
      });

      // Send notification emails to restaurant staff
      await sendNotificationEmails({
        reservationData
      });

      // Refresh availability after booking
      if (form.date) {
        fetchAvailability(form.date);
      }

      // Reset form and validation state AFTER sending emails
      setForm({
        name: "",
        email: "",
        phone: "",
        startTime: "",
        endTime: "",
        guests: "",
        specialRequests: "",
        date: "",
      });
      setValidationErrors([]);
      setValidationWarnings([]);
    } catch (error) {
      console.error('Unexpected error:', error);
      // Show error to user - do NOT send emails if an error occurred
      toast.error(t('reservations.error') || 'An unexpected error occurred. Please try again or contact the restaurant directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const daysInMonth = getDaysInMonth(calendar.year, calendar.month);
  const firstDay = getFirstDayOfWeek(calendar.year, calendar.month);

  const allowedTimes = [
    "11:30", "12:00", "12:30", "13:00", "13:30", "14:00",
    "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00"
  ];

  // Function to check if a time slot is available based on selected date AND capacity
  const isTimeSlotAvailable = (time: string) => {
    if (!form.date) return true;

    const selectedDate = new Date(form.date);
    const dayOfWeek = selectedDate.getDay();

    // Sunday is not available
    if (dayOfWeek === 0) return false;

    // Saturday: only dinner hours (18:00-22:00)
    if (dayOfWeek === 6) {
      const hour = parseInt(time.split(':')[0]);
      if (!(hour >= 18 && hour <= 22)) return false;
    } else {
      // Monday to Friday: lunch (11:30-14:00) and dinner (18:00-22:00)
      const hour = parseInt(time.split(':')[0]);
      if (!((hour >= 11 && hour <= 14) || (hour >= 18 && hour <= 22))) return false;
    }

    // Check capacity - if slot is full, mark unavailable
    if (slotAvailability[time]?.isFull) return false;

    return true;
  };

  // Function to get valid end time options based on selected start time
  const getValidEndTimes = (startTime: string) => {
    if (!startTime) return allowedTimes;
    
    const startHour = parseInt(startTime.split(':')[0]);
    const startMinute = parseInt(startTime.split(':')[1]);
    
    // Lunch period: 11:30-14:00
    if (startHour >= 11 && startHour < 14) {
      return allowedTimes.filter(time => {
        const hour = parseInt(time.split(':')[0]);
        const minute = parseInt(time.split(':')[1]);
        return (hour >= 11 && hour <= 14) && 
               (hour > startHour || (hour === startHour && minute > startMinute));
      });
  }
    
    // Dinner period: 18:00-22:00
    if (startHour >= 18 && startHour < 22) {
      return allowedTimes.filter(time => {
        const hour = parseInt(time.split(':')[0]);
        const minute = parseInt(time.split(':')[1]);
        return (hour >= 18 && hour <= 22) && 
               (hour > startHour || (hour === startHour && minute > startMinute));
      });
    }
    
    return [];
  };


  return (
    <div className="min-h-screen w-full relative flex flex-col items-center justify-center">
      <Image
        src="/images/reser-back.webp"
        alt=""
        fill
        className="object-cover object-center"
        sizes="100vw"
        quality={72}
        loading="eager"
      />
      <div className={`absolute inset-0 z-0 transition-colors duration-300 ${theme === "dark" ? "bg-black/85" : "bg-black/60"}`} />

      {/* Closure Notice Modal */}
      {showClosureModal && currentClosureHoliday && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/90 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-[95vw] sm:max-w-md md:max-w-lg lg:max-w-2xl max-h-[95vh] overflow-y-auto rounded-2xl sm:rounded-3xl shadow-2xl border-2 sm:border-4 border-[#A8D5BA] transform transition-all duration-500 hover:scale-[1.01] md:hover:scale-[1.02]">
            {/* Background Image with Overlay */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: "url(/images/parallax-image.webp)" }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/80 to-black/85 backdrop-blur-[2px]"></div>
            </div>

            {/* Content Container */}
            <div className="relative z-10 p-4 sm:p-6 md:p-8 lg:p-12">
              {/* Close Button */}
              <button
                onClick={handleCloseClosureModal}
                className="absolute top-2 right-2 sm:top-3 sm:right-3 md:top-4 md:right-4 text-2xl sm:text-3xl font-bold w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all duration-300 hover:scale-110 hover:rotate-90 backdrop-blur-sm border border-white/30 sm:border-2"
                aria-label="Close modal"
              >
                ×
              </button>

              {/* Logo with glow effect */}
              <div className="flex justify-center mb-4 sm:mb-6 md:mb-8">
                <div className="relative">
                  <div className="absolute inset-0 bg-[#A8D5BA]/30 blur-xl sm:blur-2xl rounded-full animate-pulse"></div>
                  <img
                    src="/images/east-logo.webp"
                    alt="East @ West Logo"
                    className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-40 lg:h-40 object-contain drop-shadow-2xl"
                  />
                </div>
              </div>

              {/* Closure Notice */}
              <div className="text-center space-y-3 sm:space-y-4 md:space-y-6 backdrop-blur-sm bg-black/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 border border-white/20 shadow-2xl">
                <div className="inline-block">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#A8D5BA] via-[#D4AF37] to-[#A8D5BA] animate-gradient drop-shadow-lg mb-1 sm:mb-2">
                    {t("reservations.closureModal.title")}
                  </h2>
                  <div className="h-0.5 sm:h-1 bg-gradient-to-r from-transparent via-[#A8D5BA] to-transparent rounded-full"></div>
                </div>

                <div className="bg-gradient-to-r from-[#A8D5BA]/20 via-[#A8D5BA]/30 to-[#A8D5BA]/20 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 border border-[#A8D5BA]/50 shadow-lg">
                  <p className="text-base sm:text-lg md:text-2xl lg:text-3xl font-bold text-white drop-shadow-lg leading-relaxed">
                    {t("reservations.closureModal.closedFrom")}
                  </p>
                  <p className="text-lg sm:text-xl md:text-3xl lg:text-4xl font-black text-[#D4AF37] drop-shadow-lg mt-1 sm:mt-2">
                    {formatModalDate(currentClosureHoliday.start_date)}
                  </p>
                  <p className="text-base sm:text-lg md:text-2xl lg:text-3xl font-bold text-white drop-shadow-lg mt-0.5 sm:mt-1">
                    {t("reservations.closureModal.to")}
                  </p>
                  <p className="text-lg sm:text-xl md:text-3xl lg:text-4xl font-black text-[#D4AF37] drop-shadow-lg mt-1 sm:mt-2">
                    {formatModalDate(currentClosureHoliday.end_date)}
                  </p>
                </div>

                <div className="pt-3 sm:pt-4 md:pt-6 border-t border-white/30">
                  <p className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-white/90 drop-shadow-md mb-2 sm:mb-3">
                    {t("reservations.closureModal.contactUs")}
                  </p>
                  <a
                    href="mailto:infos.east.west@gmail.com"
                    className="inline-block text-xs sm:text-sm md:text-base lg:text-xl xl:text-2xl font-bold text-[#A8D5BA] hover:text-[#D4AF37] transition-all duration-300 hover:scale-105 md:hover:scale-110 drop-shadow-lg bg-black/40 px-3 py-2 sm:px-4 sm:py-2.5 md:px-6 md:py-3 rounded-lg border border-[#A8D5BA]/50 hover:border-[#D4AF37]/70 backdrop-blur-sm break-all sm:break-normal"
                  >
                    📧 infos.east.west@gmail.com
                  </a>
                </div>

                {/* Close Button */}
                <button
                  onClick={handleCloseClosureModal}
                  className="mt-4 sm:mt-6 md:mt-8 w-full py-3 px-4 sm:py-3.5 sm:px-6 md:py-4 md:px-8 rounded-lg sm:rounded-xl font-black text-sm sm:text-base md:text-lg lg:text-xl text-white bg-gradient-to-r from-[#A8D5BA] via-[#8BC5A6] to-[#A8D5BA] hover:from-[#8BC5A6] hover:via-[#A8D5BA] hover:to-[#8BC5A6] transition-all duration-500 transform hover:scale-105 shadow-2xl border border-white/30 sm:border-2 backdrop-blur-sm hover:shadow-[#A8D5BA]/50"
                >
                  ✓ {t("reservations.closureModal.closeButton")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      
      {/* Enhanced Header Section */}
      <div className="relative z-10 w-full pt-16 pb-6 flex flex-col items-center px-4">
        <div className="text-center mb-4 mt-12">
          <h1 className={`text-5xl font-black mb-2 md:mt-12 ${
            theme === "dark"
              ? "text-white"
              : "text-white"
          } drop-shadow-2xl`}>
            {t("reservations.howToMakeReservation")}
          </h1>
          <p className={`text-base sm:text-lg font-medium ${
            theme === "dark" ? "text-white" : "text-white"
          } drop-shadow-lg`}>
            Reserve your table for an unforgettable dining experience
          </p>
        </div>
      </div>

      {/* Enhanced Main Content - 2 Columns Layout */}
      <div className="relative z-10 w-full max-w-7xl px-4 mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Calendar Container - Left Column */}
          <div className={`p-4 sm:p-6 rounded-3xl shadow-2xl  border-4 flex flex-col ${
            theme === "dark"
              ? "bg-gradient-to-br from-[#1A1A1A]/95 to-[#1A1A1A]/95 border-[#A8D5BA]"
              : "bg-gradient-to-br from-[#FFFFFF]/95 to-[#FFFFFF]/95 border-[#A8D5BA]"
          }`}>
              {/* Enhanced Calendar Section */}
              <div className={`p-4 sm:p-5 rounded-2xl shadow-xl border-2 ${
                theme === "dark"
                  ? "bg-[#1e2b05]"
                  : "bg-[#3d3a3a]"
              }`}>
            <div className={`text-center text-lg font-bold py-3 rounded-xl mb-5 text-white ${
              theme === "dark"
                ? "bg-[#1e2b05]"
                : "bg-[#404f14]"
            } shadow-lg`}>
              📅 {t("reservations.chooseTime")}
            </div>
            
            <div className="flex justify-between items-center mb-4 px-2 sm:px-3">
              <button
                type="button"
                className={`text-xl font-bold p-2 rounded-full transition-all duration-300 hover:scale-110 ${
                  theme === "dark"
                    ? "text-[#A8D5BA] hover:bg-[#A8D5BA]/20"
                    : "text-[#A8D5BA] hover:bg-[#A8D5BA]/20"
                }`}
                onClick={() => handleMonthChange(-1)}
              >
                ←
              </button>
              <span className={`text-xl font-bold ${theme === "dark" ? "text-[#A8D5BA]" : "text-[#A8D5BA]"}`}>
                {new Date(calendar.year, calendar.month).toLocaleString(i18n.language, { month: "long" })} {calendar.year}
              </span>
              <button
                type="button"
                className={`text-xl font-bold p-2 rounded-full transition-all duration-300 hover:scale-110 ${
                  theme === "dark"
                    ? "text-[#A8D5BA] hover:bg-[#A8D5BA]/20"
                    : "text-[#A8D5BA] hover:bg-[#A8D5BA]/20"
                }`}
                onClick={() => handleMonthChange(1)}
              >
                →
              </button>
            </div>
            
            <div className={`grid grid-cols-7 gap-0.5 text-center text-base font-bold mb-3 ${
              theme === "dark" ? "text-[#A8D5BA]" : "text-[#A8D5BA]"
            }`}>
              {weekDays.map((d) => (<div key={d} className="py-1">{d}</div>))}
            </div>
            
            <div className="grid grid-cols-7 gap-0.5">
              {Array(firstDay).fill(null).map((_, i) => (<div key={`empty-${i}`} />))}
              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
                const dateObj = new Date(calendar.year, calendar.month, day);
                const isSunday = dateObj.getDay() === 0;
                const isPast = dateObj < new Date(new Date().setHours(0, 0, 0, 0));
                const isClosingDay = isHoliday(dateObj);
                const isDisabled = isSunday || isPast || isClosingDay;
                const isSelected = form.date === `${calendar.year}-${String(calendar.month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

                return (
                  <button
                    key={day}
                    type="button"
                    disabled={isDisabled}
                    className={`h-12 sm:h-14 w-full flex items-center justify-center rounded-lg font-semibold text-base sm:text-lg transition-all duration-300 ${
                      isDisabled
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : isSelected
                        ? theme === "dark"
                          ? "bg-[#694440] text-[#d4331e] font-black shadow-3xl transform scale-110 ring-4 ring-[#65e20b]/50 border-2 border-[#65e20b]"
                          : "bg-[#694440] text-[#d4331e] font-black shadow-3xl transform scale-110 ring-4 ring-[#65e20b]/50 border-2 border-[#65e20b]"
                        : theme === "dark"
                        ? "text-[#F5F0E6] hover:bg-[#A8D5BA]/20 hover:scale-105"
                        : "text-[#1A1A1A] hover:bg-[#A8D5BA]/20 hover:scale-105"
                    }`}
                    onClick={() => handleDateClick(day)}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
            
                {/* Enhanced date validation errors */}
                {getFieldError('date') && (
                  <div className="mt-3 text-red-400 text-sm bg-red-500/20 p-2 rounded-xl border border-red-400/50">
                    ❌ {getFieldError('date')}
                  </div>
                )}
              </div>
          </div>

          {/* Form Container - Right Column */}
          <div className={` rounded-2xl shadow-2xl border-2 ${
            theme === "dark"
              ? "bg-gradient-to-br from-[#1A1A1A]/95 to-[#1A1A1A]/95 border-[#A8D5BA]/50"
              : "bg-gradient-to-br from-[#FFFFFF]/95 to-[#FFFFFF]/95 border-[#A8D5BA]/70"
          } p-4 sm:p-5`}>
          <form onSubmit={handleSubmit} className={`p-4 sm:p-5 rounded-2xl shadow-xl border-2 ${
            theme === "dark"
              ? "bg-beige"
              : "bg-[#313b1f]"
          }`}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              {/* Name Field */}
              <div className="flex flex-col">
                <label htmlFor="name-field" className={`text-xs font-bold mb-2 px-2 py-1 rounded-lg text-white ${
                  theme === "dark"
                    ? "bg-beige"
                    : "bg-beige"
                }`}>
                  👤 {t("reservations.fullName")}<span className="text-red-500">*</span>
                </label>
                <input
                  id="name-field"
                  name="name"
                  value={form.name}
                  onChange={handleNameChange}
                  onKeyDown={(e) => {
                    if (!/[a-zA-Z\s\-']/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'Tab' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') {
                      e.preventDefault();
                    }
                  }}
                  required
                  autoComplete="name"
                  placeholder={t("reservations.namePlaceholder")}
                  className={`p-3 rounded-xl font-medium text-xs transition-all duration-300 focus:scale-105 ${
                    theme === "dark"
                      ? "text-[#F5F0E6] placeholder-gray-400 bg-[#1A1A1A]/50 border-2 border-white focus:border-white"
                      : "text-[#1A1A1A] placeholder-gray-500 bg-[#FFFFFF]/90 border-2 border-[#2a3416] focus:border-[#A8D5BA]"
                  } ${getFieldError('name') ? 'border-red-500' : ''}`}
                />
              </div>

              {/* Email Field */}
              <div className="flex flex-col">
                <label htmlFor="email-field" className={`text-xs font-bold mb-2  px-2 py-1 rounded-lg text-white ${
                  theme === "dark"
                    ? "bg-beige"
                    : "bg-beige"
                }`}>
                  📧 {t("reservations.email")}<span className="text-red-500">*</span>
                </label>
                <input
                  id="email-field"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                  placeholder={t("reservations.emailPlaceholder")}
                  pattern="[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}"
                  title="Please enter a valid email address (e.g., user@example.com)"
                  className={`p-3 rounded-xl font-medium text-xs transition-all duration-300 focus:scale-105 ${
                    theme === "dark"
                      ? "text-[#F5F0E6] placeholder-gray-400 bg-[#1A1A1A]/50 border-2 border-white focus:border-white"
                      : "text-[#1A1A1A] placeholder-gray-500 bg-[#FFFFFF]/90 border-2 border-[#2a3416] focus:border-[#A8D5BA]"
                  } ${getFieldError('email') ? 'border-red-500' : ''}`}
                />
              </div>
            </div>

            {/* Phone Field - Full Width */}
            <div className="flex flex-col mb-4">
              <label htmlFor="phone-field" className={`text-xs font-bold mb-2 text-xs px-2 py-1 rounded-lg text-white ${
                theme === "dark"
                  ? "bg-beige"
                  : "bg-beige"
              }`}>
                📱 {t("reservations.phone")}<span className="text-red-500">*</span>
              </label>
              <input
                id="phone-field"
                name="phone"
                value={form.phone}
                onChange={handlePhoneChange}
                onKeyDown={(e) => {
                  if (!/[\d]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'Tab' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') {
                    e.preventDefault();
                  }
                }}
                required
                autoComplete="tel"
                placeholder={t("reservations.phonePlaceholder")}
                title="Please enter a phone number"
                className={`p-3 rounded-xl font-medium text-xs transition-all duration-300 focus:scale-105 ${
                  theme === "dark"
                    ? "text-[#F5F0E6] placeholder-gray-400 bg-[#1A1A1A]/50 border-2 border-white focus:border-white"
                    : "text-[#1A1A1A] placeholder-gray-500 bg-[#FFFFFF]/90 border-2 border-[#2a3416] focus:border-[#A8D5BA]"
                } ${getFieldError('phone') ? 'border-red-500' : ''}`}
              />
            </div>

            {/* Time Fields Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              {/* Start Time Field */}
              <div className="flex flex-col">
                <label htmlFor="start-time-field" className={`text-xs font-bold mb-2 text-xs px-2 py-1 rounded-lg text-white ${
                  theme === "dark"
                    ? "bg-green-900"
                    : "bg-green-900"
                }`}>
                  🕐 {t("reservations.time")}<span className="text-red-500">*</span>
                </label>
                <select
                  id="start-time-field"
                  name="startTime"
                  value={form.startTime}
                  onChange={handleChange}
                  required
                  className={`p-3 rounded-xl font-medium text-xs transition-all duration-300 focus:scale-105 ${
                    theme === "dark"
                      ? "text-[#F5F0E6] bg-[#1A1A1A]/50 border-2 border-white focus:border-white"
                      : "text-[#1A1A1A] bg-[#FFFFFF]/90 border-2 border-[#2a3416] focus:border-[#A8D5BA]"
                  } ${getFieldError('startTime') ? 'border-red-500' : ''}`}
                >
                  <option value="" className={theme === "dark" ? "text-gray-300" : "text-gray-700"}>
                    {t("reservations.selectTime")}
                  </option>
                  {allowedTimes.map((time) => {
                    const available = isTimeSlotAvailable(time);
                    const slot = slotAvailability[time];
                    const isFull = slot?.isFull;
                    let label = time;
                    if (isFull) {
                      label = `${time}  (${t('reservations.noMoreReservation') || 'No more reservation possible'})`;
                    }
                    return (
                      <option
                        key={time}
                        value={time}
                        className={theme === "dark" ? "text-white bg-gray-800" : "text-gray-900 bg-white"}
                        disabled={!available}
                      >
                        {label}
                      </option>
                    );
                  })}
                </select>

              </div>

              {/* End Time Field */}
              <div className="flex flex-col">
                <label htmlFor="end-time-field" className={`text-xs font-bold mb-2 text-xs px-2 py-1 rounded-lg text-white ${
                  theme === "dark"
                    ? "bg-beige"
                    : "bg-beige"
                }`}>
                  🕐 {t("reservations.until")}<span className="text-red-500">*</span>
                </label>
                <select
                  id="end-time-field"
                  name="endTime"
                  value={form.endTime}
                  onChange={handleChange}
                  required
                  className={`p-3 rounded-xl font-medium text-xs transition-all duration-300 focus:scale-105 ${
                    theme === "dark"
                      ? "text-[#F5F0E6] bg-[#1A1A1A]/50 border-2 border-white focus:border-white"
                      : "text-[#1A1A1A] bg-[#FFFFFF]/90 border-2 border-[#2a3416] focus:border-[#A8D5BA]"
                  } ${getFieldError('endTime') ? 'border-red-500' : ''}`}
                >
                  <option value="" className={theme === "dark" ? "text-gray-300" : "text-gray-700"}>
                    {t("reservations.selectTime")}
                  </option>
                  {getValidEndTimes(form.startTime).map((time) => (
                    <option
                      key={time}
                      value={time}
                      className={theme === "dark" ? "text-white bg-gray-800" : "text-gray-900 bg-white"}
                    >
                      {time}
                    </option>
                  ))}
                </select>

              </div>
            </div>

            {/* No more reservation message - shown when selected time slot is full */}
            {form.startTime && slotAvailability[form.startTime]?.isFull && (
              <div className="mb-4 p-3 rounded-xl border bg-red-500/20 border-red-400/50">
                <span className="text-xs font-bold text-red-400">
                  {t('reservations.noMoreReservation') || 'No more reservation is possible for this time slot'}
                </span>
              </div>
            )}

            {/* Guests Field */}
            <div className="flex flex-col mb-4">
              <label htmlFor="guests-field" className={`text-xs font-bold mb-2 px-2 py-1 rounded-lg text-white ${
                theme === "dark"
                  ? "bg-beige"
                  : "bg-beige"
              }`}>
                👥 {t("reservations.numberOfGuests")}<span className="text-red-500">*</span>
              </label>
              <select
                id="guests-field"
                name="guests"
                value={form.guests}
                onChange={handleChange}
                required
                className={`p-3 rounded-xl font-medium text-xs transition-all duration-300 focus:scale-105 ${
                  theme === "dark"
                    ? "text-[#F5F0E6] bg-[#1A1A1A]/50 border-2 border-white focus:border-white"
                    : "text-[#1A1A1A] bg-[#FFFFFF]/90 border-2 border-[#2a3416] focus:border-[#A8D5BA]"
                } ${getFieldError('guests') ? 'border-red-500' : ''}`}
              >
                <option value="" className={theme === "dark" ? "text-gray-300" : "text-gray-700"}>
                  {t("reservations.selectGuests")}
                </option>
                {[...Array(22)].map((_, i) => {
                  const guestCount = i + 1;
                  const slot = form.startTime ? slotAvailability[form.startTime] : null;
                  const exceedsCapacity = slot ? guestCount > slot.remainingCapacity : false;
                  return (
                    <option
                      key={guestCount}
                      value={guestCount}
                      className={theme === "dark" ? "text-white bg-gray-800" : "text-gray-900 bg-white"}
                      disabled={exceedsCapacity}
                    >
                      {guestCount}
                    </option>
                  );
                })}
              </select>

              {/* Enhanced warnings for guest count */}
              {validationWarnings.length > 0 && (
                <div className="mt-2">
                  {validationWarnings.map((warning, index) => (
                    <div key={index} className="text-yellow-400 text-xs bg-yellow-600/20 p-2 rounded-xl border border-yellow-400/50">
                      ⚠️ {warning}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Special Requests Field */}
            <div className="flex flex-col mb-4">
              <label htmlFor="special-requests-field" className={`text-xs font-bold mb-2 px-2 py-1 rounded-lg text-white ${
                theme === "dark"
                  ? "bg-beige"
                  : "bg-beige"
              }`}>
                💭 {t("reservations.specialRequests")}
              </label>
              <textarea
                id="special-requests-field"
                name="specialRequests"
                value={form.specialRequests}
                onChange={handleChange}
                rows={3}
                placeholder={t("reservations.specialRequestsPlaceholder")}
                className={`p-3 rounded-xl font-medium text-xs transition-all duration-300 focus:scale-105 resize-none ${
                  theme === "dark"
                    ? "text-[#F5F0E6] placeholder-gray-400 bg-[#1A1A1A]/50 border-2 border-white focus:border-white"
                    : "text-[#1A1A1A] placeholder-gray-500 bg-[#FFFFFF]/50 border-2 border-[#A8D5BA]/50 focus:border-[#A8D5BA]"
                }`}
              />
            </div>

            {/* Enhanced Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3">
              <button
                type="submit"
                disabled={validationErrors.length > 0 || isSubmitting}
                className={`font-bold text-base py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg ${
                  validationErrors.length > 0 || isSubmitting
                    ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
                    : theme === "dark"
                    ? 'bg-gradient-to-r from-[#1A1A1A] to-[#1A1A1A] text-[#FFFFFF] hover:from-[#1A1A1A] hover:to-[#1A1A1A] shadow-[#1A1A1A]/50'
                    : 'bg-gradient-to-r from-[#A8D5BA] to-[#A8D5BA] text-[#FFFFFF] hover:from-[#A8D5BA] hover:to-[#A8D5BA] shadow-[#A8D5BA]/50'
                }`}
              >
                {isSubmitting ? '⏳ Submitting...' : `✅ ${t("reservations.confirmReservation")}`}
              </button>

            </div>
          </form>
          </div>
        </div>

      </div>

      {/* Enhanced Business Hours Section - Below Main Container */}
      <div className="relative z-10 w-full max-w-7xl px-4 mb-6">
        <div className={`p-4 sm:p-5 rounded-2xl shadow-2xl  border-2 text-center ${
          theme === "dark"
            ? "bg-gradient-to-br from-[#1A1A1A]/90 to-[#1A1A1A]/90 border-[#A8D5BA]/50"
            : "bg-gradient-to-br from-[#FFFFFF]/95 to-[#FFFFFF]/95 border-[#A8D5BA]/70"
        }`}>
          <div className={`text-center font-bold py-3 rounded-xl mb-4 ${
            theme === "dark"
              ? "text-white"
              : "text-black"
          } shadow-lg`}>
            🕐 <span className={`text-3xl ${theme === "dark" ? "text-white" : "text-black"}`}>{t("reservations.businessHours")}</span>
          </div>

          <div className="flex flex-col text-center w-full">
            <div className={`text-2xl font-bold mb-1 ${theme === "dark" ? "text-white" : "text-black"}`}>
              12:00 – 14:30
            </div>
            <div className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-black"}`}>
              18:00 – 22:00
            </div>
          </div>

          <div className="w-full">
            <div className={`text-2xl font-black text-center mb-2 mt-3 ${theme === "dark" ? "text-white" : "text-black"}`}>
              🍽️ LUNCH
            </div>
            <div className={`text-center ${theme === "dark" ? "text-white" : "text-black"}`}>
              <p className="text-2xl font-semibold">12:00 – 14:30</p>
              <p className="text-2xl font-medium mt-6">Last reservation at 14:30</p>
            </div>

            <div className={`text-2xl font-black text-center mb-4 mt-6 ${theme === "dark" ? "text-white" : "text-black"}`}>
              🍽️ DINNER
            </div>
            <div className={`text-center ${theme === "dark" ? "text-white" : "text-black"}`}>
              <p className="text-2xl font-semibold">18:00 – 22:00</p>
              <p className="text-2xl font-medium my-6">Last reservation at 20:30</p>
            </div>
          </div>

          <div className="w-full">
            <div className={`text-2xl font-black text-center mb-2 ${theme === "dark" ? "text-white" : "text-black"}`}>
              🎉 Saturday
            </div>
            <div className={`text-center text-2xl ${theme === "dark" ? "text-white" : "text-black"}`}>
              18:00 – 22:00
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
