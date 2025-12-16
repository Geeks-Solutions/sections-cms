<template>
  <div class="w-full mt-6">
    <div class="flex flex-col items-start justify-start mt-8">
      <div class="flex">
        <label class="mr-4 font-bold">{{ $t('Token ID*') }}</label>
      </div>
      <span class="text-sm py-1 text-grayText">{{
        $t('The token ID must match the token id in your smart contract')
      }}</span>
      <input
        v-model="whitelistSettings.token_id"
        type="text"
        value=""
        :placeholder="$t('Token ID*')"
        :class="[
          'py-4 pl-6 border rounded-xl h-48px w-full focus:outline-none',
          errors.token_id ? 'border-error' : 'border-FieldGray',
        ]"
      />
    </div>
    <div class="flex flex-col items-start justify-start mt-8">
      <div class="flex">
        <label class="mr-4 font-bold">{{ $t('Whitelist index*') }}</label>
      </div>
      <span class="text-sm py-1 text-grayText">{{
        $t(
          'The whitelist index must match the whitelist index of your smart contract',
        )
      }}</span>
      <input
        v-model="whitelistSettings.index"
        type="text"
        value=""
        :placeholder="$t('Whitelist index*')"
        :class="[
          'py-4 pl-6 border rounded-xl h-48px w-full focus:outline-none',
          errors.index ? 'border-error' : 'border-FieldGray',
        ]"
      />
    </div>

    <div class="flex flex-col items-start justify-start mt-8">
      <div class="flex">
        <label class="mr-4 font-bold">{{ $t('Entries*') }}</label>
      </div>
      <span class="text-sm py-1 text-TextGray">{{
        $t('Entries should be separated by commas')
      }}</span>
      <textarea
        v-model="whitelistSettings.entries"
        type="text"
        :placeholder="$t('Entries*')"
        :class="[
          'py-4 pl-6 border rounded-xl h-150px w-full focus:outline-none',
          errors.entries ? 'border-error' : 'border-FieldGray',
        ]"
      />
    </div>

    <div class="flex flex-col items-start justify-start mt-8">
      <div class="flex">
        <label class="mr-4 font-bold">{{ $t('Whitelist ID') }}</label>
      </div>
      <input
        v-model="whitelistSettings.id"
        type="number"
        disabled
        value=""
        :placeholder="$t('Whitelist ID')"
        :class="[
          'py-4 pl-6 border rounded-xl h-48px w-full focus:outline-none',
          errors.id ? 'border-error' : 'border-FieldGray',
        ]"
      />
    </div>

    <div class="flex flex-col items-start justify-start mt-8">
      <div class="flex">
        <label class="mr-4 font-bold">{{ $t('Root') }}</label>
      </div>
      <span class="text-sm py-1 text-grayText">{{
        $t('Store your root into your smart contract')
      }}</span>
      <input
        v-model="whitelistSettings.root"
        type="text"
        disabled
        value=""
        :placeholder="$t('Root')"
        :class="[
          'py-4 pl-6 border rounded-xl h-48px w-full focus:outline-none',
          errors.root ? 'border-error' : 'border-FieldGray',
        ]"
      />
    </div>

    <div class="bg-white sticky bottom-0">
      <div class="flex gap-4">
        <button
          class="flex items-center justify-center form-control bg-Blue text-white border-Blue border hover:text-Blue px-3.5 h-53px py-3.5 rounded-xl hover:bg-white mt-4 mb-4"
          @click="hashFunction"
        >
          {{ editMode ? $t('Edit whitelist') : $t('Add whitelist') }}
        </button>
        <button
          class="flex items-center justify-center form-control bg-Blue text-white border-Blue border hover:text-Blue px-3.5 h-53px py-3.5 rounded-xl hover:bg-white mt-4 mb-4"
          data-toggle="tooltip"
          data-placement="top"
          title="We will check, if the root in your whitelist entry match the root in your smart contract"
          @click="verifyMatch"
        >
          {{ $t('Root match verification') }}
        </button>
      </div>

      <span v-show="formError" class="text-error text-sm pt-2 pl-2">{{
        formError
      }}</span>
      <span v-show="formSuccess" class="text-Blue text-sm pt-2 pl-2">{{
        formSuccess
      }}</span>
    </div>
  </div>
</template>

<script>
import Web3 from 'web3'

export default {
  name: 'NftMintWhitelistTest',
  props: {
    sectionSettings: {
      type: Object,
      default: () => {},
    },
    sectionOptions: {
      type: Object,
      default: () => {},
    },
  },

  data() {
    return {
      settings: {
        whitelist_id: 0,
      },
      whitelistSettings: {
        id: null,
        token_id: null,
        index: null,
        entries: '',
        root: '',
      },
      errors: {
        token_id: false,
        index: false,
        entries: false,
        id: false,
      },
      formError: '',
      formSuccess: '',
      whitelistServerUrl: 'https://w3wl.geeks.solutions/api',
      editMode: false,
      web3: {
        coinbase: '',
      },
    }
  },
  async mounted() {
    this.$emit('customFormLoaded')

    if (
      this.sectionSettings.settings &&
      this.sectionSettings.settings.whitelist_id
    ) {
      this.editMode = true
      const URL = this.whitelistServerUrl
      const response = await this.$axios
        .get(
          URL + `/whitelist/${this.sectionSettings.settings.whitelist_id}`,
          {},
        )
        .catch(() => {})
      if (response && response.data && !response.data.error) {
        this.whitelistSettings = response.data
        this.whitelistSettings.entries = response.data.entries.join(', ')
      }
    }
  },

  methods: {
    verifyMatch() {
      this.formError = ''
      this.formSuccess = ''
      if (
        !this.sectionOptions.contract_addr ||
        !this.sectionOptions.contract_abi ||
        !this.whitelistSettings.root
      ) {
        this.formError =
          'Contract address, contract abi, token id, whitelist index and root are required to verify the match'
      } else {
        try {
          const web3 = new Web3(Web3.givenProvider)
          const nftContract = new web3.eth.Contract(
            JSON.parse(this.sectionOptions.contract_abi),
            this.sectionOptions.contract_addr,
          )
          nftContract.methods
            .getWhiteListAtIndex(
              this.whitelistSettings.token_id,
              this.whitelistSettings.index,
            )
            .call()
            .then((res) => {
              if (res.merkle_root === this.whitelistSettings.root) {
                this.formSuccess = 'Match verified'
              } else {
                this.formError = `Root don't match, please update your root for your token id ${this.whitelistSettings.token_id} and whitelist index ${this.whitelistSettings.index} on your smart contract`
              }
            })
            .catch(() => {
              this.formError = `Root don't match, please update your root for your token id ${this.whitelistSettings.token_id} and whitelist index ${this.whitelistSettings.index} on your smart contract`
            })
        } catch (e) {
          this.formError = `Root don't match, please update your root for your token id ${this.whitelistSettings.token_id} and whitelist index ${this.whitelistSettings.index} on your smart contract`
        }
      }
    },
    hashFunction() {
      this.formError = ''
      if (this.validate()) {
        let whitelistIdString
        if (this.whitelistSettings.id) {
          whitelistIdString = this.whitelistSettings.id.toString()
        } else whitelistIdString = '0'
        const currentDate = new Date()
        const timestamp = Math.floor(currentDate.getTime() / 1000)
        let finalHash
        this.$axios
          .post(
            `${this.$config.NUXT_ENV_SECTIONS_PROJECT_URL}/server-middleware/getWLHash`,
            {
              app_id: this.$config.NUXT_ENV_SECTIONS_PROJECT_ID,
              timestamp: timestamp.toString(),
              dataString: `${timestamp.toString()}${whitelistIdString}${this.whitelistSettings.index}${this.whitelistSettings.token_id}`,
              // dataString: timestamp.toString().concat(whitelistIdString).concat(this.whitelistSettings.index).concat(this.whitelistSettings.token_id)
            },
          )
          .then((value) => {
            if (value.status === 200) {
              finalHash = value.data.data
              this.whitelistSettings.id
                ? this.editWhitelist(finalHash)
                : this.createWhitelist(finalHash)
            }
          })
          .catch(() => {
            this.formError = 'WHITELIST_HASH_PRIVATE_KEY is not setup yet'
          })
      }
    },
    async createWhitelist(finalHash) {
      this.$emit('load', true)
      this.formError = ''
      this.formSuccess = ''
      this.whitelistSettings.entries =
        this.whitelistSettings.entries.replaceAll(' ', '')
      const URL = this.whitelistServerUrl
      const response = await this.$axios
        .post(
          URL + `/whitelist`,
          // `/whitelist`,
          {
            project_id: this.$config.NUXT_ENV_SECTIONS_PROJECT_ID,
            token_id: parseInt(this.whitelistSettings.token_id),
            whitelist_index: parseInt(this.whitelistSettings.index),
            entries: this.whitelistSettings.entries.split(','),
          },
          {
            headers: {
              signature: finalHash,
            },
          },
        )
        .catch(() => {
          this.$emit('load', false)
          this.formError = `Your project already declared the whitelist for token id ${this.whitelistSettings.token_id} and whitelist id ${this.whitelistSettings.index}`
        })
      if (response && response.data) {
        this.$emit('load', false)
        this.editMode = true
        this.formSuccess = this.$t(
          'Make sure to submit the section to add it to your page',
        )
        this.whitelistSettings = response.data
        this.whitelistSettings.id = response.data.id
        this.$emit('whitelistIdUpdated', response.data.id)
      }
    },
    async editWhitelist(finalHash) {
      this.$emit('load', true)
      this.formError = ''
      this.formSuccess = ''
      this.whitelistSettings.entries =
        this.whitelistSettings.entries.replaceAll(' ', '')
      const URL = this.whitelistServerUrl
      const response = await this.$axios
        .put(
          URL + `/whitelist/${this.whitelistSettings.id}`,
          // `/whitelist/${this.whitelistSettings.id}`,
          {
            project_id: this.$config.NUXT_ENV_SECTIONS_PROJECT_ID,
            token_id: parseInt(this.whitelistSettings.token_id),
            index: parseInt(this.whitelistSettings.index),
            entries: this.whitelistSettings.entries.split(','),
          },
          {
            headers: {
              signature: finalHash,
            },
          },
        )
        .catch((error) => {
          this.$emit('load', false)
          this.formError = error.response.data.message
        })
      this.$emit('load', false)
      this.formSuccess = this.$t(
        'Make sure to submit the section to add it to your page',
      )
      this.whitelistSettings = response.data
      this.whitelistSettings.entries = response.data.entries.join(', ')
      this.whitelistSettings.id = response.data.id
      this.$emit('whitelistIdUpdated', response.data.id)
    },
    validate() {
      let valid = true
      this.errors.token_id = false
      this.errors.index = false
      this.errors.entries = false
      if (!this.whitelistSettings.token_id) {
        this.errors.token_id = true
        valid = false
      }
      if (this.whitelistSettings.index === null) {
        this.errors.index = true
        valid = false
      }
      if (!this.whitelistSettings.entries) {
        this.errors.entries = true
        valid = false
      }
      if (!valid) {
        this.$root.$emit('toast', {
          type: 'Error',
          message: this.$t('fill-required-fields'),
        })
      }
      return valid
    },
  },
}
</script>

<style scoped></style>
