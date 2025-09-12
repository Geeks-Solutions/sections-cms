<template>
  <div class="p-4">

    <div :id="`mapApiKey`" class="flex flex-col items-start justify-start mt-8">
      <label :class="sectionsStyle.fieldLabel">{{ $t("forms.mapApiKey") + '*' }}</label>
      <p class="text-start pb-2"><span class="text-sm">{{ $t('forms.apiKeyDesc') }}</span> <a href="https://developers.google.com/maps/documentation/javascript/get-api-key" target="_blank" class="underline text-sm text-Blue">Google Cloud Console</a></p>
      <input
        v-model="settings[0].mapApiKey"
        type="text"
        :placeholder="$t('forms.mapApiKey')"
        :class="sectionsStyle.input"
      />
      <span v-show="errors[`mapApiKey`] === true"
            class="text-error text-sm pt-2 pl-2">{{ $t('forms.requiredField') }}</span>
    </div>

    <div id="content" class="flex flex-col items-start justify-start mt-8">
      <label :class="sectionsStyle.fieldLabel">{{ $t("forms.content") }}</label>
      <LazyEditorWysiwyg :html="settings[0].content[selectedLang]" :css-classes-prop="settings[0].contentClasses" @cssClassesChanged="(v) => settings[0]['contentClasses'] = v" @wysiwygMedia="wysiwygMediaAdded" @settingsUpdate="(content) => updateContent(content)"/>
    </div>

    <div class="my-4">
      <label class="flex section-module-upload-media-label">{{ $t('forms.mapZoom') }}</label>
      <div class="select-style-chooser">
        <gAutoComplete
          :main-filter="settings[0].zoom"
          :placeholder="$t('forms.mapZoom')"
          :filter-label-prop="'value'"
          :reduce="(option) => option.key"
          :filter-options="[{key: 'fit_pins', value: $t('forms.fitPins')}, {key: '1', value: '1'}, {key: '2', value: '2'}, {key: '3', value: '3'}, {key: '4', value: '4'}, {key: '5', value: '5'}, {key: '6', value: '6'}, {key: '7', value: '7'}, {key: '8', value: '8'}, {key: '9', value: '9'}, {key: '10', value: '10'}, {key: '11', value: '11'}, {key: '12', value: '12'}, {key: '13', value: '13'}, {key: '14', value: '14'}, {key: '15', value: '15'}]"
          :filter-searchable="false"
          :close-on-select="true"
          :filter-clearable="true"
          :track-by="'key'"
          @itemSelected="(val) => {settings[0].zoom = val;}"
        >
        </gAutoComplete>
      </div>
    </div>

    <div class="flex flex-row justify-center mt-8">
      <h3 :class="sectionsStyle.fieldLabel">{{ $t("forms.pins") }}</h3>
    </div>
    <div id="pins" class="flex flex-col mt-4">
      <LazySectionsFormsFieldSets :array-data-pop="settings[0].pins" :fieldset-group="'pins'" :legend-label="$t('forms.pin')" @array-updated="(data) => settings[0]['pins'] = data" @remove-fieldset="(object, idx) => removePinBlock(idx)">

        <template #default="{ object, idx }">
          <div>

            <div :id="`pin-name-${idx}`" class="flex flex-col items-start justify-start mt-8">
              <label :class="sectionsStyle.fieldLabel">{{ $t("forms.name") }}</label>
              <input
                v-model="object.name[selectedLang]"
                type="text"
                :placeholder="$t('forms.name')"
                :class="sectionsStyle.input"
              />
              <span v-show="errors[`pin-name-${idx}`] === true && selectedLang === defaultLang"
                    class="text-error text-sm pt-2 pl-2">{{ $t('forms.requiredField') }}</span>
            </div>

            <div :id="`pin-type-${idx}`" class="flex flex-col items-start justify-start mt-8">
              <label :class="sectionsStyle.fieldLabel">{{ $t("forms.pinType") }}</label>
              <input
                v-model="object.type"
                type="text"
                :placeholder="$t('forms.pinType')"
                :class="sectionsStyle.input"
                @input="settings[0].pins[idx] = {...object, type: object.type}"
              />
              <span v-show="errors[`pin-type-${idx}`] === true"
                    class="text-error text-sm pt-2 pl-2">{{ $t('forms.requiredField') }}</span>
            </div>

            <div :id="`pin-media-${idx}`" class="mt-8">
              <LazyMediasUploadMedia :media-label="$t('forms.media')" :upload-text="$t('forms.uploadMedia')" :change-text="$t('forms.changeMedia')" :seo-tag="$t('forms.seoTag')" :media="object.media && Object.keys(object.media).length > 0 ? [object.media] : []" @uploadContainerClicked="uploadMedia(idx)" @removeUploadedImage="mediaFieldIndex = idx; removeMedia(idx)" />
              <span v-show="errors[`pin-media-${idx}`] === true"
                    class="text-error text-sm pt-2 pl-2">{{ $t('forms.requiredField') }}</span>
            </div>

            <div class="flex flex-col items-start justify-start mt-8">
              <label :class="sectionsStyle.fieldLabel">{{ $t("forms.description") }}</label>
              <textarea
                v-model="object.description[selectedLang]"
                type="text"
                :placeholder="$t('forms.description')"
                :class="sectionsStyle.textarea"
              />
            </div>

          </div>
        </template>

      </LazySectionsFormsFieldSets>

      <div
        class="add-button underline cursor-pointer mt-2"
        @click="addPin()"
      >
        <div class="p3 bold text">{{ $t("forms.addPin") }}</div>
      </div>
    </div>

    <div class="flex flex-row justify-center mt-8">
      <h3 :class="sectionsStyle.fieldLabel">{{ $t("forms.addresses") }}</h3>
    </div>
    <div id="addresses" class="flex flex-col mt-4">
      <LazySectionsFormsFieldSets :array-data-pop="settings[0].addresses" :fieldset-group="'addresses'" :legend-label="$t('forms.address')" @array-updated="(data) => settings[0]['addresses'] = data" @remove-fieldset="(object, idx) => removeAddressBlock(idx)">

        <template #default="{ object, idx }">
          <div>

            <div :id="`address-name-${idx}`" class="flex flex-col items-start justify-start mt-8">
              <label :class="sectionsStyle.fieldLabel">{{ $t("forms.name") + '*' }}</label>
              <input
                v-model="object.name[selectedLang]"
                type="text"
                :placeholder="$t('forms.name')"
                :class="sectionsStyle.input"
              />
              <span v-show="errors[`address-name-${idx}`] === true && selectedLang === defaultLang"
                    class="text-error text-sm pt-2 pl-2">{{ $t('forms.requiredField') }}</span>
            </div>

            <div class="flex flex-col items-start justify-start mt-8">
              <label :class="sectionsStyle.fieldLabel">{{ $t("forms.description") }}</label>
              <textarea
                v-model="object.description[selectedLang]"
                type="text"
                :placeholder="$t('forms.description')"
                :class="sectionsStyle.textarea"
              />
            </div>

            <div class="flex flex-col items-start justify-start mt-8">
              <label :class="sectionsStyle.fieldLabel">{{ $t("forms.phone") }}</label>
              <input
                v-model="settings[0].addresses[idx].phone"
                type="text"
                :placeholder="$t('forms.phone')"
                :class="sectionsStyle.input"
              />
            </div>

            <div class="flex flex-col items-start justify-start mt-8">
              <label :class="sectionsStyle.fieldLabel">{{ $t("forms.email") }}</label>
              <input
                v-model="settings[0].addresses[idx].email"
                type="text"
                :placeholder="$t('forms.email')"
                :class="sectionsStyle.input"
              />
            </div>

            <div :id="`address-type-${idx}`" class="flex flex-col items-start justify-start mt-8">
              <div class="flex flex-col items-start my-4">
                <label :class="sectionsStyle.fieldLabel">{{ $t("forms.pinType") + '*' }}</label>
                <span class="text-sm pb-2">{{ $t('forms.addPinsFirst') }}</span>
                <div class="select-style-chooser">
                  <gAutoComplete
                    :main-filter="settings[0].addresses[idx].type"
                    :placeholder="$t('forms.pinType')"
                    :filter-label-prop="'value'"
                    :reduce="(option) => option.key"
                    :filter-options="[...defaultPins, ...settings[0].pins.filter(pin => pin.type !== '' && pin.name[selectedLang] !== '').map(pin => {return {key: pin.type, option: pin.name[selectedLang], value: pin.name[selectedLang], selected: pin.name[selectedLang], image: pin.media && pin.media.url ? pin.media.url : '', label: pin.media && pin.media.url ? pin.media.url : ''}})]"
                    :filter-searchable="false"
                    :close-on-select="true"
                    :filter-clearable="true"
                    :track-by="'key'"
                    @itemSelected="(val) => {settings[0].addresses[idx].type = val;}"
                  >
                    <template #selected-option="{ selected, label }">
                      <div style="display: flex; flex-direction: row; align-items: center">
                        <img :src="label" alt="" style="width: 43px; padding: 8px;" />
                        <span style="margin: 0.5rem 0.5rem;">{{ selected }}</span>
                      </div>
                    </template>
                    <template #option="{ option, label }">
                      <div style="display: flex; flex-direction: row; align-items: center">
                        <img :src="label" alt="" style="width: 43px; padding: 8px;" />
                        <span style="margin: 0.5rem 0.5rem;">{{ option }}</span>
                      </div>
                    </template>
                  </gAutoComplete>
                </div>
              </div>
              <span v-show="errors[`address-type-${idx}`] === true"
                    class="text-error text-sm pt-2 pl-2">{{ $t('forms.requiredField') }}</span>
            </div>

            <div :id="`address-street-${idx}`" class="flex flex-col items-start justify-start mt-8">
              <label :class="sectionsStyle.fieldLabel">{{ $t("forms.street") + '*' }}</label>
              <input
                v-model="object.street[selectedLang]"
                type="text"
                :placeholder="$t('forms.street')"
                :class="sectionsStyle.input"
              />
              <span v-show="errors[`address-street-${idx}`] === true && selectedLang === defaultLang"
                    class="text-error text-sm pt-2 pl-2">{{ $t('forms.requiredField') }}</span>
            </div>

            <div :id="`address-city-${idx}`" class="flex flex-col items-start justify-start mt-8">
              <label :class="sectionsStyle.fieldLabel">{{ $t("forms.city") + '*' }}</label>
              <input
                v-model="object.city[selectedLang]"
                type="text"
                :placeholder="$t('forms.city')"
                :class="sectionsStyle.input"
              />
              <span v-show="errors[`address-city-${idx}`] === true && selectedLang === defaultLang"
                    class="text-error text-sm pt-2 pl-2">{{ $t('forms.requiredField') }}</span>
            </div>

            <div :id="`address-country-${idx}`" class="flex flex-col items-start justify-start mt-8">
              <label :class="sectionsStyle.fieldLabel">{{ $t("forms.country") + '*' }}</label>
              <input
                v-model="object.country[selectedLang]"
                type="text"
                :placeholder="$t('forms.country')"
                :class="sectionsStyle.input"
              />
              <span v-show="errors[`address-country-${idx}`] === true && selectedLang === defaultLang"
                    class="text-error text-sm pt-2 pl-2">{{ $t('forms.requiredField') }}</span>
            </div>

            <div :id="`address-lat-${idx}`" class="flex flex-col items-start justify-start mt-8">
              <label :class="sectionsStyle.fieldLabel">{{ $t("forms.lat") + '*' }}</label>
              <span class="text-sm md:cursor-pointer underline pb-2" @click="openMapSelection(idx, settings[0].addresses[idx].lat, settings[0].addresses[idx].lng)">{{ $t('forms.selectFromMap') }}</span>
              <input
                v-model="settings[0].addresses[idx].lat"
                :placeholder="$t('forms.lat')"
                :class="sectionsStyle.input"
              />
              <span v-show="errors[`address-lat-${idx}`] === true"
                    class="text-error text-sm pt-2 pl-2">{{ $t('forms.requiredField') }}</span>
            </div>

            <div :id="`address-lng-${idx}`" class="flex flex-col items-start justify-start mt-8">
              <label :class="sectionsStyle.fieldLabel">{{ $t("forms.lng") + '*' }}</label>
              <span class="text-sm md:cursor-pointer underline pb-2" @click="openMapSelection(idx, settings[0].addresses[idx].lat, settings[0].addresses[idx].lng)">{{ $t('forms.selectFromMap') }}</span>
              <input
                v-model="settings[0].addresses[idx].lng"
                :placeholder="$t('forms.lng')"
                :class="sectionsStyle.input"
              />
              <span v-show="errors[`address-lng-${idx}`] === true"
                    class="text-error text-sm pt-2 pl-2">{{ $t('forms.requiredField') }}</span>
            </div>

          </div>
        </template>

      </LazySectionsFormsFieldSets>

      <div
          class="add-button underline cursor-pointer mt-2"
          @click="addAddress()"
      >
        <div class="p3 bold text">{{ $t("forms.addAddress") }}</div>
      </div>
    </div>

    <div v-if="showMapSelection" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white p-4 rounded-lg shadow-lg w-full max-w-lg relative">
        <button class="absolute top-2 right-2 text-gray-600 hover:text-black" @click="showMapSelection = false; selectedAddressIndex = null; marker = null; zoom = 1">
          ✕
        </button>

        <div class="w-full h-80 mt-5">
          <LazyLMap
            style="height: 100%"
            :zoom="zoom"
            :center="center"
            @click="setLocation"
          >
            <LazyLTileLayer :url="tileLayerUrl"></LazyLTileLayer>
            <LazyLMarker v-if="marker" :lat-lng="marker" :icon="markerIcon"></LazyLMarker>
          </LazyLMap>
        </div>

        <div class="mt-4 text-right">
          <button
            class="px-4 py-2 bg-Blue text-white rounded hover:bg-Blue"
            @click="confirmLocation"
          >
            {{ $t('forms.confirm') }}
          </button>
        </div>
      </div>
    </div>

    <LazySectionFormErrors :selectedLang="selectedLang" :default-lang="defaultLang" :locales="locales" :errors="errors" />

  </div>
</template>

<i18n src="./Shared_i18n.json"></i18n>

<script>
import { sectionsStyle, scrollToFirstError, assignMediaObject } from '../../utils/constants'

export default {
  name: 'GoogleMaps',
  setup() {
    const { t } = useI18n({
      useScope: 'local'
    })

    return {
      $t: t
    }
  },
  props: {
    selectedLang: {
      type: String,
      default: 'en'
    },
    defaultLang: {
      type: String,
      default: 'en'
    },
    selectedMedia: {},
    locales: {
      type: Array,
      default() {
        return []
      }
    },
    mediaFields: [
      {
        type: 'image',
        name: 'medias'
      },
      {
        type: 'image',
        name: 'wysiwygMedia'
      }
    ]
  },
  data() {
    return {
      settings: [
        {
          mapApiKey: '',
          content: {
            en: '',
            fr: ''
          },
          contentClasses: '',
          zoom: 'fit_pins',
          addresses: [
            {
              name: {
                en: '',
                fr: ''
              },
              description: {
                en: '',
                fr: ''
              },
              phone: '',
              email: '',
              type: '',
              street: {
                en: '',
                fr: ''
              },
              city: {
                en: '',
                fr: ''
              },
              country: {
                en: '',
                fr: ''
              },
              lat: '',
              lng: ''
            }
          ],
          pins: [
            {
              name: {
                en: '',
                fr: ''
              },
              type: '',
              media: {},
              description: {
                en: '',
                fr: ''
              }
            }
          ],
          medias: []
        }
      ],
      errors: {},
      siteLang: 'en',
      mediaFieldIndex: '',
      sectionsStyle,
      selectedAddressIndex: null,
      L: null,
      showMapSelection: false,
      zoom: 1,
      center: [this.lat || 48.8566, this.lng || 2.3522], // Default to Paris
      marker: null,
      tileLayerUrl: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      markerIcon: null,
      defaultPins: [
        {
          "value": "Default 1",
          "option": "Default 1",
          "selected": "Default 1",
          "key": "default1",
          "image": "https://maps.google.com/mapfiles/ms/micons/red.png",
          "label": "https://maps.google.com/mapfiles/ms/micons/red.png",
        },
        {
          "value": "Default 2",
          "option": "Default 2",
          "selected": "Default 2",
          "key": "default2",
          "image": "https://maps.google.com/mapfiles/ms/micons/blue.png",
          "label": "https://maps.google.com/mapfiles/ms/micons/blue.png",
        },
        {
          "value": "Default 3",
          "option": "Default 3",
          "selected": "Default 3",
          "key": "default3",
          "image": "https://maps.google.com/mapfiles/ms/micons/green.png",
          "label": "https://maps.google.com/mapfiles/ms/micons/green.png",
        }
      ]
    }
  },
  watch: {
    selectedLang(val) {
      this.siteLang = val
    },
    selectedMedia(mediaObject) {
      let media = {}
      media = assignMediaObject(mediaObject)
      if (this.settings[0].pins[this.mediaFieldIndex].media.media_id) {
        const mediaIndex = this.settings[0].medias.findIndex(media => media.media_id === this.settings[0].pins[this.mediaFieldIndex].media.media_id)
        if (mediaIndex !== -1) {
          this.settings[0].medias[mediaIndex] = media
        } else {
          this.settings[0].medias.push(media)
        }
      } else {
        this.settings[0].medias.push(media)
      }
      this.settings[0].pins[this.mediaFieldIndex]['media'] = media
      this.$emit('closeMediaModal')
    }
  },
  async mounted() {
    const L = await import("leaflet");
    await import("leaflet/dist/leaflet.css");

    this.L = L;
    this.markerIcon = L.icon({
      iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
      iconSize: [22, 32],
      iconAnchor: [16, 32]
    })
  },
  methods: {
    openMapSelection(idx, lat, lng) {
      if (lat && lng) {
        this.marker = [lat, lng];
      } else {
        this.marker = null
      }
      this.showMapSelection = true;
      this.selectedAddressIndex = idx;
    },
    setLocation(event) {
      this.marker = [event.latlng.lat, event.latlng.lng];
    },
    confirmLocation() {
      if (this.marker) {
        this.settings[0].addresses[this.selectedAddressIndex].lat = this.marker[0]
        this.settings[0].addresses[this.selectedAddressIndex].lng = this.marker[1]
      }
      this.marker = null
      this.selectedAddressIndex = null
      this.zoom = 1
      this.showMapSelection = false
    },
    wysiwygMediaAdded(media) {
      this.settings.push({
        wysiwygMedia: media,
        wysiwygLang: this.selectedLang
      })
    },
    uploadMedia(idx) {
      this.mediaFieldIndex = idx;
      this.$emit('openMediaModal', Object.keys(this.settings[0].pins[idx].media).length > 0 ? this.settings[0].pins[idx].media.media_id : null)
    },
    removeMedia(idx) {
      const removeAtIndex = this.settings[0].medias.findIndex(media => media.media_id === this.settings[0].pins[idx].media.media_id)
      this.settings[0].medias.splice(removeAtIndex, 1)
      this.settings[0].pins[idx].media = {}
    },
    updateContent(content) {
      this.settings[0].content[this.selectedLang] = content
    },
    addAddress() {
      this.settings[0].addresses.push({
        name: {
          en: '',
          fr: ''
        },
        description: {
          en: '',
          fr: ''
        },
        phone: '',
        email: '',
        type: '',
        street: {
          en: '',
          fr: ''
        },
        city: {
          en: '',
          fr: ''
        },
        country: {
          en: '',
          fr: ''
        },
        lat: '',
        lng: ''
      });
    },
    removeAddressBlock(idx) {
      if (this.settings[0].addresses.length > 1) {
        this.settings[0].addresses = this.settings[0].addresses.filter((blc, i) => idx !== i);
      }
    },
    addPin() {
      this.settings[0].pins.push({
        name: {
          en: '',
          fr: ''
        },
        type: '',
        media: {},
        description: {
          en: '',
          fr: ''
        }
      });
    },
    removePinBlock(idx) {
      if (this.settings[0].pins.length > 1) {
        this.settings[0].pins = this.settings[0].pins.filter((blc, i) => idx !== i);
      }
    },
    validate() {
      if (Array.isArray(this.settings)) {
        this.settings.forEach((ob, index) => {
          if (ob.wysiwygLang) {
            if (!JSON.stringify(this.settings[0]).includes(ob.wysiwygMedia.media_id)) {
              this.settings.splice(index, 1)
            }
          }
        })
      }
      let valid = true;
      this.errors = {};

      if (!this.settings[0].mapApiKey) {
        this.errors.mapApiKey = true
        valid = false
      }

      this.settings[0].addresses.forEach((address, idx) => {
        if (!address.name[this.defaultLang]) {
          this.errors[`address-name-${idx}`] = true;
          valid = false;
        }
        if (!address.type) {
          this.errors[`address-type-${idx}`] = true;
          valid = false;
        }
        if (!address.lat) {
          this.errors[`address-lat-${idx}`] = true;
          valid = false;
        }
        if (!address.lng) {
          this.errors[`address-lng-${idx}`] = true;
          valid = false;
        }
        if (!address.street[this.defaultLang]) {
          this.errors[`address-street-${idx}`] = true;
          valid = false;
        }
        if (!address.city[this.defaultLang]) {
          this.errors[`address-city-${idx}`] = true;
          valid = false;
        }
        if (!address.country[this.defaultLang]) {
          this.errors[`address-country-${idx}`] = true;
          valid = false;
        }
      })

      if (!valid && this.selectedLang === this.defaultLang) {
        scrollToFirstError(this.errors)
      }
      return valid;
    },
  },
}
</script>

<style>
.content-wrapper {
  overflow-x: hidden;
}
</style>
