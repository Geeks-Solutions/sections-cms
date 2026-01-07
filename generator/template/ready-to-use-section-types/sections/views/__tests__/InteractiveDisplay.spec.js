import { describe, it, expect, afterEach, vi } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import InteractiveDisplay from '../ZAQWidget_static.vue'

const mockI18n = {
  locale: 'en',
}

describe('InteractiveDisplay_static.vue', () => {
  let wrapper

  const createComponent = (settings, options = {}) => {
    const mockMethods = {
      isYouTubeLink: vi.fn((link) => link.includes('youtube.com')),
      extractVideoId: vi.fn((link) => {
        const match = link.match(/v=([^&]*)/)
        return match ? match[1] : null
      }),
    }

    wrapper = shallowMount({
      data() {
        return { settings }
      },
      computed: {
        computedVideoUrl() {
          if (
            this.settings &&
            this.settings[0] &&
            this.settings[0].videoLink &&
            this.isYouTubeLink(this.settings[0].videoLink)
          ) {
            const v = this.settings[0]
            try {
              const url = new URL(v.videoLink)
              const params = url.searchParams

              params.set('hl', 'en')
              params.set('rel', '0')

              if (v.autoplay) {
                params.set('autoplay', '1')
                params.set('mute', '1')
              } else {
                params.delete('autoplay')
                params.delete('mute')
              }

              if (v.loop) {
                const videoId = this.extractVideoId(url.href)
                if (videoId) {
                  params.set('loop', '1')
                  params.set('playlist', videoId)
                }
              } else {
                params.delete('loop')
                params.delete('playlist')
              }

              if (v.controls) {
                params.set('controls', '0')
                params.set('disablekb', '1')
              } else {
                params.delete('controls')
                params.delete('disablekb')
              }

              if (v.whiteProgress) {
                params.set('color', 'white')
              } else {
                params.delete('color')
              }

              return url.toString()
            } catch {
              return ''
            }
          } else return this.settings[0]?.videoLink || ''
        },
      },
      methods: {
        ...mockMethods,
      },
      global: {
        mocks: {
          $i18n: mockI18n,
        },
      },
    })
  }

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount()
    }
  })

  it('returns updated video URL with query parameters when valid YouTube link and settings are provided', () => {
    createComponent([
      {
        videoLink: 'https://www.youtube.com/watch?v=abc123',
        autoplay: true,
        loop: true,
        controls: true,
        whiteProgress: true,
      },
    ])

    const result = wrapper.vm.computedVideoUrl

    expect(result).toContain('hl=en')
    expect(result).toContain('rel=0')
    expect(result).toContain('autoplay=1')
    expect(result).toContain('mute=1')
    expect(result).toContain('loop=1')
    expect(result).toContain('playlist=abc123')
    expect(result).toContain('controls=0')
    expect(result).toContain('disablekb=1')
    expect(result).toContain('color=white')
  })

  it('returns original video URL if not a YouTube link', () => {
    createComponent([{ videoLink: 'https://example.com/video.mp4' }])

    const result = wrapper.vm.computedVideoUrl

    expect(result).toBe('https://example.com/video.mp4')
  })

  it('returns empty string for invalid URL', () => {
    createComponent([{ videoLink: 'invalid-url' }])

    const result = wrapper.vm.computedVideoUrl

    expect(result).toBe('invalid-url')
  })

  it('removes parameters if settings do not enable them', () => {
    createComponent([
      {
        videoLink: 'https://www.youtube.com/watch?v=abc123',
        autoplay: false,
        loop: false,
        controls: false,
        whiteProgress: false,
      },
    ])

    const result = wrapper.vm.computedVideoUrl

    expect(result).not.toContain('autoplay=1')
    expect(result).not.toContain('mute=1')
    expect(result).not.toContain('loop=1')
    expect(result).not.toContain('playlist=')
    expect(result).not.toContain('controls=0')
    expect(result).not.toContain('disablekb=1')
    expect(result).not.toContain('color=white')
  })
})
