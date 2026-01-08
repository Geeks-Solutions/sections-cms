import { describe, it, expect, afterEach, vi } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import InteractiveDisplayStatic from '../InteractiveDisplay_static.vue'

const mockI18n = {
  locale: 'en',
}

describe('InteractiveDisplay_static.vue', () => {
  let wrapper

  const createComponent = (settings, options = {}) => {
    wrapper = shallowMount(InteractiveDisplayStatic, {
      props: {
        section: { settings },
        lang: 'en',
      },
      global: {
        mocks: {
          $i18n: mockI18n,
        },
      },
      ...options,
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

  it('returns modified videoLink when mobileVideoLink is not set and videoLink is a YouTube link', () => {
    createComponent([
      {
        videoLink: 'https://www.youtube.com/watch?v=12345',
        mobileVideoLink: '',
        autoplay: true,
        loop: true,
        controls: true,
        whiteProgress: true,
      },
    ])

    const result = wrapper.vm.computedMobileVideoUrl

    expect(result).toContain('https://www.youtube.com/watch?v=12345')
    expect(result).toContain('autoplay=1')
    expect(result).toContain('mute=1')
    expect(result).toContain('loop=1')
    expect(result).toContain('playlist=12345')
    expect(result).toContain('controls=0')
    expect(result).toContain('disablekb=1')
    expect(result).toContain('color=white')
  })

  it('returns modified mobileVideoLink when mobileVideoLink is set and is a YouTube link', () => {
    createComponent([
      {
        videoLink: 'https://www.youtube.com/watch?v=12345',
        mobileVideoLink: 'https://www.youtube.com/watch?v=67890',
        mobileAutoplay: false,
        mobileLoop: true,
        mobileControls: true,
        mobileWhiteProgress: false,
      },
    ])

    const result = wrapper.vm.computedMobileVideoUrl

    expect(result).toContain('https://www.youtube.com/watch?v=67890')
    expect(result).not.toContain('autoplay=1')
    expect(result).not.toContain('mute=1')
    expect(result).toContain('loop=1')
    expect(result).toContain('playlist=67890')
    expect(result).toContain('controls=0')
    expect(result).toContain('disablekb=1')
    expect(result).not.toContain('color=white')
  })

  it('returns mobileVideoLink when it is set but not a YouTube link', () => {
    createComponent([
      {
        videoLink: 'https://www.youtube.com/watch?v=12345',
        mobileVideoLink: 'https://example.com/video.mp4',
      },
    ])

    const result = wrapper.vm.computedMobileVideoUrl

    expect(result).toBe('https://example.com/video.mp4')
  })

  it('returns videoLink when mobileVideoLink is empty and videoLink is not a YouTube link', () => {
    createComponent([
      {
        videoLink: 'https://example.com/video.mp4',
        mobileVideoLink: '',
      },
    ])

    const result = wrapper.vm.computedMobileVideoUrl

    expect(result).toBe('https://example.com/video.mp4')
  })
})
