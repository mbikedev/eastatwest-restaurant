/**
 * Preload critical resources for LCP optimization
 * This component should be placed in the document head
 */
export default function PreloadResources() {
  return (
    <>
      {/* Preload LCP hero image */}
      <link
        rel="preload"
        as="image"
        href="/images/banner.webp"
        type="image/webp"
        fetchPriority="high"
      />

      {/* Preconnect to external domains */}
      <link rel="preconnect" href="https://restaurantguru.com" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="https://restaurantguru.com" />
    </>
  );
}
