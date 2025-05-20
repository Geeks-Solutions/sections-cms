<template>
  <div class="cookieControl">
    <transition :name="`cookieControl__Bar--${cookies.barPosition}`">
      <div v-if="colorsSet && !cookies.consent" :class="`cookieControl__Bar cookieControl__Bar--${cookies.barPosition}`">
        <div class="cookieControl__BarContainer">
          <div>
            <slot name="bar">
              <h3>{{ $t('cookieConsent.barTitle') }}</h3>
              <p>{{ $t('cookieConsent.barDescription') }}</p>
            </slot>
          </div>
          <div class="cookieControl__BarButtons">
            <button v-if="cookies.acceptNecessary" class="button-selector" @click="cookies.acceptNecessary">{{ $t('cookieConsent.necessary') }}</button>
            <button class="button-selector" @click="cookies.modal = true">{{ $t('cookieConsent.manageCookies') }}</button>
            <button class="button-selector" @click="setConsent({reload: false})">{{ $t('cookieConsent.acceptAll') }}</button>
          </div>
        </div>
      </div>
    </transition>
    <button v-if="cookies.controlButton && colorsSet && cookies.consent" class="cookieControl__ControlButton" aria-label="Cookie control" @click="cookies.modal = true">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M510.52 255.82c-69.97-.85-126.47-57.69-126.47-127.86-70.17 0-127-56.49-127.86-126.45-27.26-4.14-55.13.3-79.72 12.82l-69.13 35.22a132.221 132.221 0 00-57.79 57.81l-35.1 68.88a132.645 132.645 0 00-12.82 80.95l12.08 76.27a132.521 132.521 0 0037.16 72.96l54.77 54.76a132.036 132.036 0 0072.71 37.06l76.71 12.15c27.51 4.36 55.7-.11 80.53-12.76l69.13-35.21a132.273 132.273 0 0057.79-57.81l35.1-68.88c12.56-24.64 17.01-52.58 12.91-79.91zM176 368c-17.67 0-32-14.33-32-32s14.33-32 32-32 32 14.33 32 32-14.33 32-32 32zm32-160c-17.67 0-32-14.33-32-32s14.33-32 32-32 32 14.33 32 32-14.33 32-32 32zm160 128c-17.67 0-32-14.33-32-32s14.33-32 32-32 32 14.33 32 32-14.33 32-32 32z"/></svg>
    </button>
    <transition name="cookieControl__Modal">
      <div v-if="cookies.modal" class="cookieControl__Modal">
        <p v-if="!saved" class="cookieControl__ModalUnsaved">{{ $t('cookieConsent.unsaved') }}</p>
        <div class="cookieControl__ModalContent">
          <div>
            <slot name="modal"/>
            <div class="cookieControl__ModalClose" @click="cookies.modal = false">
              <svg width="30" height="30" viewBox="0 0 10 10" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M3.89862 4.99959L0.159756 8.73862C0.0569105 8.84154 0.000163078 8.97886 0 9.12528C0 9.27179 0.0567484 9.40927 0.159756 9.51203L0.487399 9.83959C0.590407 9.94276 0.727724 9.99927 0.87431 9.99927C1.02065 9.99927 1.15797 9.94276 1.26098 9.83959L4.99984 6.10081L8.73886 9.83959C8.84171 9.94276 8.97911 9.99927 9.12561 9.99927C9.27195 9.99927 9.40935 9.94276 9.5122 9.83959L9.84 9.51203C10.0533 9.2987 10.0533 8.95171 9.84 8.73862L6.10106 4.99959L9.84 1.26073C9.94293 1.15764 9.99959 1.02032 9.99959 0.8739C9.99959 0.727478 9.94293 0.590161 9.84 0.487153L9.51228 0.159593C9.40943 0.0565033 9.27195 -8.29697e-05 9.12569 -8.29697e-05C8.97919 -8.29697e-05 8.84179 0.0565033 8.73894 0.159593L4.99992 3.89845L1.26106 0.159593C1.15805 0.0565033 1.02073 -8.29697e-05 0.874391 -8.29697e-05H0.874228C0.727805 -8.29697e-05 0.590488 0.0565033 0.48748 0.159593L0.159838 0.487153C0.0569925 0.59008 0.000244141 0.727478 0.000244141 0.8739C0.000244141 1.02032 0.0569925 1.15764 0.159838 1.26065L3.89862 4.99959Z" fill="currentColor"/>
              </svg>
            </div>
            <template v-for="type in ['necessary', 'optional']">
              <template v-if="cookies[type] && cookies[type].length > 0">
                <h3 :key="type.id">{{ $t('cookieConsent.'+ type) }}</h3>
                <ul :key="type.id">
                  <li v-for="cookie in cookies[type]" :key="cookie.id">
                    <div class="cookieControl__ModalInputWrapper">
                      <input v-if="type === 'necessary' && cookie.name !== 'functional'" :id="getCookieFirstName(cookie.name)" type="checkbox" disabled checked/>
                      <input v-else :id="getCookieFirstName(cookie.name)" type="checkbox" :checked="(useCookie('cookie_control_consent').value !== undefined && useCookie('cookie_control_consent').value === true && useCookie('cookie_control_enabled_cookies').value && useCookie('cookie_control_enabled_cookies').value.includes(cookie.identifier)) || (useCookie('cookie_control_consent').value === undefined && cookie.initialState === true)" @change="toggleCookie(cookie)"/>
                      <label :for="getCookieFirstName(cookie.name)" v-html="cookie.name"/>
                      <span class="cookieControl__ModalCookieName">
                          {{ $t(cookie.name) }}
                          <span v-if="cookie.description" v-html="$t(cookie.description)"/>
                        </span>
                    </div>
                    <template v-if="cookie.cookies">
                      <slot name="cookie" v-bind="{config: cookie}">
                        <ul>
                          <li v-for="item in cookie.cookies" :key="item.id" v-html="item"/>
                        </ul>
                      </slot>
                    </template>
                  </li>
                </ul>
              </template>
            </template>
            <div class="cookieControl__ModalButtons">
              <button class="button-selector shadowed" @click="setConsent({type: 'partial'})">{{ $t('cookieConsent.save') }}</button>
              <button class="button-selector shadowed" @click="setConsent({declineAll: true, consent: true})">{{ $t('cookieConsent.declineAll') }}</button>
              <button class="button-selector" @click="setConsent">{{ $t('cookieConsent.acceptAll') }}</button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { useCookie } from '#imports'

export default {
  name: 'CookieControl',
  props: {
    gtmId: {
      type: String,
      default: ''
    }
  },
  data() {
    return{
      saved: true,
      colorsSet: true,
      cookies: {
        modal: false,
        consent: useCookie('cookie_control_consent').value,
        enabled: [],
        enabledList: [],
        css: true,
        cssPolyfill: true,
        controlButton: true,
        acceptNecessary: false,
        dashInDescription: false,
        barPosition: 'bottom-full',
        necessary: [
          {
            identifier: "technical",
            name: "cookieConsent.defaultCookies",

            cookies: ["sections-auth-token", "cookie_control_consent", "cookie_control_enabled_cookies", "tag_manager"]
          }
        ],
        optional: [
          {
            name:  'Google Analytics',
            // if you don't set identifier, slugified name will be used
            identifier: 'ga',
            description: 'cookieConsent.gaDesc',
            initialState: true,
            async:  true,
            cookies: ['_ga', '_ga_XXXXXXXXXX'],
            accepted: () => {

            }
          },
          {
            name:  'Hotjar',
            // if you don't set identifier, slugified name will be used
            identifier: 'hj',
            description: '',
            initialState: true,
            async:  true,
            cookies: ['_hjIncludedInSessionSample_XXXXXXX', '_hjFirstSeen', '_hjAbsoluteSessionInProgress', '_hjSession_XXXXXXX', '_hjSessionUser_XXXXXXX'],
            accepted: () => {

            }
          }
        ]
      }
    }
  },
  computed: {
    expirationDate(){
      const date = new Date();
      date.setFullYear(date.getFullYear()+1);
      return date;
    },
    optionalCookies(){
      return this.cookies.optional;
    }
  },
  beforeMount() {
    try {
      const allCookies = document.cookie.split(';').reduce((cookies, cookie) => {
        const [name, value] = cookie.trim().split('=').map(part => decodeURIComponent(part))
        cookies[name] = value
        return cookies
      }, {})

      if(useCookie('cookie_control_enabled_cookies').value !== undefined && useCookie('cookie_control_enabled_cookies').value.length !== 0){
        this.optionalCookies.forEach(c => {
          for (const cookieKey of Object.keys(allCookies)) {
            if(cookieKey.includes(c.identifier) && !useCookie('cookie_control_enabled_cookies').value.includes(c.identifier)) {
              useCookie(cookieKey).value = null
            }
          }
          if(c.initialState === true && useCookie('cookie_control_enabled_cookies').value.includes(c.identifier)) {
            this.cookies.enabledList.push(c.identifier);
            if (c.accepted) {
              this.$emit('consent')
              c.accepted(c.identifier)
            }
          }
        })
      } else if(useCookie('cookie_control_consent').value === undefined) {
        this.optionalCookies.forEach(c => {
          if(c.initialState === true) {
            this.cookies.enabledList.push(c.identifier);
          }
        })
      } else if(useCookie('cookie_control_consent').value === false || useCookie('cookie_control_enabled_cookies').value.length === 0) {
        this.optionalCookies.forEach(c => {
          for (const cookieKey of Object.keys(allCookies)) {
            if(cookieKey.includes(c.identifier) && !useCookie('cookie_control_enabled_cookies').value.includes(c.identifier)) {
              useCookie(cookieKey).value = null
            }
          }
        })
      }
    } catch {}
  },
  methods: {
    useCookie,
    toggleCookie(cookie) {
      const cookieName = cookie.identifier;
      if(this.saved) this.saved = false;
      if(!this.cookies.enabledList.includes(cookieName)) this.cookies.enabledList.push(cookieName);
      else this.cookies.enabledList.splice(this.cookies.enabledList.indexOf(cookieName), 1);
    },
    setConsent({type, consent=true, reload=true, declineAll=false}){
      useCookie( 'cookie_control_consent', {expires: this.expirationDate}).value = consent;
      const enabledCookies = declineAll ? [] : type === 'partial' && consent ? this.cookies.enabledList : [...this.optionalCookies.map(c => c.identifier)];
      useCookie('cookie_control_enabled_cookies', {expires: this.expirationDate}).value = consent ? enabledCookies.join(',') : '';
      if(!reload){
        this.setConsent({})
        // this.$cookies.modal = false;
      } else window.location.reload();
    },
    getCookieFirstName(name){
      return typeof(name) === 'string' ? name : name[Object.keys(name)[0]]
    }
  }
}
</script>

<style>
.cookieControl__Modal {
  z-index: 10;
}
</style>

