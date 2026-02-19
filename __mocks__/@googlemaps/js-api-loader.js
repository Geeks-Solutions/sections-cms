import { vi } from 'vitest'

export const Loader = vi.fn().mockImplementation(() => ({
  importLibrary: vi.fn().mockResolvedValue({
    Map: vi.fn().mockImplementation(() => ({
      setCenter: vi.fn(),
      setZoom: vi.fn(),
      fitBounds: vi.fn(),
      getZoom: vi.fn().mockReturnValue(10),
    })),
    LatLngBounds: vi.fn().mockImplementation(() => ({
      extend: vi.fn(),
      getCenter: vi.fn().mockReturnValue({ lat: () => 48.8566, lng: () => 2.3522 }),
    })),
    InfoWindow: vi.fn().mockImplementation(() => ({
      setContent: vi.fn(),
      open: vi.fn(),
      close: vi.fn(),
      addListener: vi.fn(),
    })),
    AdvancedMarkerElement: vi.fn().mockImplementation((options) => ({
      position: options.position,
      setMap: vi.fn(),
      addListener: vi.fn((event, callback) => {
        if (event === 'gmp-click') {
          setTimeout(() => callback(), 0)
        }
      }),
    })),
    Geocoder: vi.fn().mockImplementation(() => ({
      geocode: vi.fn().mockResolvedValue({
        results: [
          {
            geometry: {
              location: {
                lat: () => 48.8566,
                lng: () => 2.3522,
              },
            },
          },
        ],
      }),
    })),
  }),
}))

export default { Loader }
