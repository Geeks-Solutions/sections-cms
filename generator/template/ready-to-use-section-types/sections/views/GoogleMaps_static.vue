<template>
  <div v-if="settings" class="GoogleMaps mb-16 py-2.5 md:mx-auto max-w-7xl">

    <div class="flex flex-col w-full mx-auto pb-10 map-content">

      <gWysiwygContent v-if="settings.content && settings.content[lang]" tag="div" :wrapper-classes="settings.contentClasses" :classes="`p-0`" :html-content="settings.content[lang]" />

    </div>

    <div :ref="`map-${section.weight}`" class="w-full h-[447px] map-wrapper"></div>

    <div class="grid md:flex grid-cols-2 md:flex-row md:flex-wrap text-Gray_800 gap-y-5 gap-x-3 md:gap-3 mt-8 md:ml-4 pins-wrapper">
      <div v-for="(pin, pinIdx) in settings.pins" :key="`pin-${pinIdx}`" class="flex flex-col items-start gap-1">
        <div class="flex flex-row items-center gap-1">
          <img v-if="pin.media && pin.media.url"
               :src="pin.media.url"
               :alt="pin.media.seo_tag ? pin.media.seo_tag : ''"
               class="pin-media"/>
          <div class="flex flex-col items-start gap-1">
            <p v-if="pin.name && pin.name[lang]" class="pin-name">{{ pin.name[lang] }}</p>
            <p v-if="pin.description && pin.description[lang]" class="pin-desc">{{ pin.description[lang] }}</p>
          </div>
        </div>
      </div>
    </div>

    <div v-if="filteredAddresses.length > 0" class="flex flex-col border-b border-gray-300 mt-4 addresses-main-wrapper">
      <div v-for="(object, key) in filteredAddresses" :key="`address-${key}`" class="grid grid-cols-2 address-wrapper w-full text-sm border-t border-gray-300 justify-between py-7">

        <div class="flex flex-col">
          <h4 v-if="object.name && object.name[lang]">
            {{ object.name[lang] }}
          </h4>
        </div>

        <div class="flex flex-col address-details">
          <div class="flex flex-col details">
            <p v-if="object.description && object.description[lang]">
              {{ object.description[lang] }}
            </p>
            <p v-if="object.country && object.country[lang]">
              {{ object.country[lang] }}
            </p>
            <p v-if="object.city && object.city[lang]">
              {{ object.city[lang] }}
            </p>
            <p v-if="object.street && object.street[lang]">
              {{ object.street[lang] }}
            </p>
          </div>
          <div class="flex flex-col links">
            <a v-if="object.phone" :href="`tel:${object.phone}`" class="pt-4 underline md:cursor-pointer phone sections-cta-link">
              {{ object.phone }}
            </a>
            <a v-if="object.email" :href="`mailto:${object.email}`" class="underline md:cursor-pointer email sections-cta-link">
              {{ object.email }}
            </a>
            <a :href="`http://maps.google.com/maps?saddr=&daddr=(${object.lat}, ${object.lng})`" target="_blank" class="directions-btn button-selector">{{ $t('forms.getDirections') }}</a>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>

<i18n src="../forms/GoogleMaps_i18n.json"></i18n>

<script>
/* global google */
import * as Loader from '@googlemaps/js-api-loader'
import { showToast } from '#imports'
import { sectionsStyle } from '../../utils/constants'

export default {
  name: 'GoogleMapsStatic',
  setup() {
    const { t } = useI18n({
      useScope: 'local'
    })

    return {
      $t: t,
      t
    }
  },
  props: {
    section: {
      type: Object,
      default: () => {},
    },
    lang: {
      type: String,
      default: "en"
    },
    weight: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      searchLocation: '',
      mapLoaded: false,
      loader: null,
      infoWindow: null,
      map: null,
      markers: [],
      filteredAddresses: [],
      selectedAddress: null,
      sectionsStyle,
      defaultPins: {
        "default1": "https://maps.google.com/mapfiles/ms/micons/red.png",
        "default2": "https://maps.google.com/mapfiles/ms/micons/blue.png",
        "default3": "https://maps.google.com/mapfiles/ms/micons/green.png"
      }
    }
  },
  computed: {
    settings() {
      if (this.section.settings) {
        return this.section.settings[0]
      } else {
        return null
      }
    }
  },
  watch: {
    section: {
      async handler() {
        if(this.settings && this.settings.addresses && this.settings.addresses.length > 0 && this.map && process.client) {
          await this.initAddresses(true)
          this.$nextTick(() => {
            if (this.map && this.settings.zoom !== 'fit_pins') {
              const bounds = new google.maps.LatLngBounds();
              this.markers.forEach(object => {
                bounds.extend(object.marker.position);
              })
              const center = bounds.getCenter(); // Get center of all markers
              this.map.setCenter(center);
              this.map.setZoom(this.getZoomLevel())
            } else if (this.map && this.settings.zoom === 'fit_pins') {
              const bounds = new google.maps.LatLngBounds();
              this.markers.forEach(object => {
                bounds.extend(object.marker.position);
              })
              this.map.fitBounds(bounds);
            }
          })
        }
      },
      deep: true,
      immediate: true
    }
  },
  async mounted() {
    await this.initAddresses()
  },
  methods: {
    async initAddresses(skipZoom) {
      this.filteredAddresses = []
      if(this.settings && this.settings.addresses && this.settings.addresses.length > 0 && this.settings.mapApiKey) {
        this.initLoader();
        if (this.map) {
          this.map = null
        }
        const map = await this.initMap();
        this.map = map;
        await this.initMarkers(map);
        if (map && this.settings.zoom && !skipZoom) {
          const bounds = new google.maps.LatLngBounds();
          this.markers.forEach(object => {
            bounds.extend(object.marker.position);
          })
          if (this.settings.zoom === 'fit_pins') {
            map.fitBounds(bounds);
          } else if (this.settings.zoom !== 'fit_pins') {
            const center = bounds.getCenter(); // Get center of all markers
            map.setCenter(center);
            map.setZoom(Number(this.settings.zoom))
          }
        }
      }
    },
    initLoader() {
      this.loader = new Loader.Loader({
        apiKey: this.settings.mapApiKey
      });
    },
    getZoomLevel() {
      return this.settings.zoom ? Number(this.settings.zoom) : 2
    },
    async initMap() {
      const { Map } = await this.loader.importLibrary("maps")
      return new Map(this.$refs[`map-${this.section.weight}`], {
        center: { lat: 0, lng: 0 },
        zoom: this.settings.zoom !== 'fit_pins' ? this.getZoomLevel() : 2,
        minZoom: 1,
        mapId: 'META_SECTIONS_MAP',
        mapTypeControl: false
      })
    },
    async initMarkers(map) {
      if (this.loader) {
        this.removeMarkers()

        const { AdvancedMarkerElement } = await this.loader.importLibrary("marker")

        let addresses = this.settings.addresses

        if (this.filteredAddresses.length > 0) {
          addresses = this.filteredAddresses.map(({ marker, distance, ...rest }) => rest.address)
        }

        addresses.forEach(addr => {

          if (addr.lat && addr.lng) {
            const addressMarker = document.createElement("img");
            addressMarker.src =
              this.settings.pins.find(pin => pin.type === addr.type) && this.settings.pins.find(pin => pin.type === addr.type).media ? this.settings.pins.find(pin => pin.type === addr.type).media.url : this.defaultPins[addr.type] ? this.defaultPins[addr.type] : ''
            addressMarker.width = 43
            addressMarker.height = 43

            this.infoWindow = new google.maps.InfoWindow();

            const marker = new AdvancedMarkerElement({
              position: {lat: Number(addr.lat), lng: Number(addr.lng)},
              map: map,
              title: addr.name[this.lang],
              content: addressMarker
            })
            this.markers.push({
              marker,
              addr
            })

            const directLabel = this.t('forms.getDirections')

            marker.addListener("gmp-click", () => {
              this.filteredAddresses = []
              if (this.infoWindow) {
                this.infoWindow.close();
              }
              this.filteredAddresses.push({
                ...addr
              })
              this.infoWindow.setContent(
                `<div style="display: flex; flex-direction: column; width: max-content;">
<h5 style="padding-bottom: 10px;"> <b>${addr.name[this.lang]}</b> </h5>
<div style="display: flex; flex-direction: column; gap: 5px;">
<p>${addr.description[this.lang]}</p>
<p v-if="${addr.country && addr.country[this.lang]}">
            ${addr.country[this.lang]}
          </p>
          <p v-if="${addr.city && addr.city[this.lang]}">
            ${addr.city[this.lang]}
          </p>
          <p v-if="${addr.street && addr.street[this.lang]}">
            ${addr.street[this.lang]}
          </p>
          <a v-if="${addr.phone}" href="tel:${addr.phone}" class="pt-4 underline md:cursor-pointer phone sections-cta-link">
            ${addr.phone}
          </a>
          <a v-if="${addr.email}" href="mailto:${addr.email}" class="underline md:cursor-pointer email sections-cta-link">
            ${addr.email}
          </a>
<a href="http://maps.google.com/maps?saddr=&daddr=(${addr.lat}, ${addr.lng})" target="_blank" id="getDirections" class="directions-btn button-selector">${directLabel}</a>
</div>
</div>`)
              this.infoWindow.open({
                anchor: marker,
                map: map,
              });
              this.infoWindow.addListener('closeclick', ()=>{
                this.filteredAddresses = []
              });
            });
          }
        })
      }
    },
    removeMarkers() {
      for (let i = 0; i < this.markers.length; i++) {
        this.markers[i].marker.setMap(null)
      }
      this.markers = []
    },
    rad(x) {
      return x * Math.PI / 180;
    },
    formatDistance(d) {
      if (d) {
        return Math.floor(d).toFixed(1)
      } else return ''
    },
    getDistance(p1, p2) {
      const R = 6378137; // Earth’s mean radius in meter
      const dLat = this.rad(p2.lat - p1.lat);
      const dLong = this.rad(p2.lng - p1.lng);
      const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(this.rad(p1.lat)) * Math.cos(this.rad(p2.lat)) *
        Math.sin(dLong / 2) * Math.sin(dLong / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return (R * c) / 1000; // returns the distance in kilometer
    },
    selectAddress() {
      if (this.selectedAddress) {
        const foundMarker = this.markers.find(item => item.addr.lat === this.selectedAddress.addr.lat && item.addr.lng === this.selectedAddress.addr.lng).marker
        this.infoWindow.close()
        google.maps.event.trigger(foundMarker, 'click')
      }
    },
    async findAddress() {
      if (this.searchLocation) {

        const { Geocoder } = await this.loader.importLibrary("geocoding")

        const geocoder = new Geocoder()

        const bounds = new google.maps.LatLngBounds();

        geocoder.geocode({ address: this.searchLocation }).then(async ({ results }) => {

          this.selectedAddress = null
          this.infoWindow.close()
          this.filteredAddresses = []
          await this.initMarkers()

          this.markers.forEach(object => {
            if (object.address.lat && object.address.lng) {
              const distance = this.getDistance({lat: object.addr.lat, lng: object.addr.lng}, {lat: results[0].geometry.location.lat(), lng: results[0].geometry.location.lng()})
              if (distance <= 100) {
                this.filteredAddresses.push({address: object.address, marker: object.marker, distance})
                bounds.extend(object.marker.position);
              }
            }
          })

          if (this.filteredAddresses.length > 0) {
            await this.initMarkers()
            if (this.filteredAddresses.length === 1) {
              const minZoomLevel = 15
              if (this.map.getZoom() < minZoomLevel) {
                this.map.fitBounds(bounds);
                this.map.setZoom(minZoomLevel);
              }
            } else {
              this.map.fitBounds(bounds);
            }
          } else {
            showToast("", "info", this.$t('forms.noAddresses'));
          }

        }).catch(() => {
          showToast("", "info", this.$t('forms.noAddresses'));
        })

      } else {
        showToast("", "info", this.$t('forms.noAddresses'));
      }
    }
  }
};
</script>

<style>
.directions-btn {
  cursor: pointer;
  margin: 5px 0 0;
}
.GoogleMaps img.pin-media {
  width: 43px;
  height: 43px;
}
@media screen and (max-width: 768px) {
  .gm-style .gm-style-iw-c {
    max-width: 100% !important;
  }
}
</style>
