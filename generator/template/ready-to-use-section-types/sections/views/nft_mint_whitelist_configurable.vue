<template>
  <div v-if="show" id="nftSection" class="rowStyle items-center">
    <div class="text-center blockStyle my-8">
      <div>
        <vue-metamask
          ref="metamask"
          :init-connect="false"
          @onComplete="onComplete"
        ></vue-metamask>
        <div
          v-if="mobile === true || desktop === true"
          class="absolute z-50 mb-4 bg-Dark bg-opacity-0 h-screen top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        >
          <div class="relative top-1/3 p-4 bg-white rounded-lg shadow">
            <div v-if="mobile === true" class="fontStyle pb-4">
              Metamask app's browser is required to connect on Mobile
            </div>
            <div v-else-if="desktop === true" class="fontStyle pb-1">
              Please to install the Metamask extention
            </div>
            <div>
              <a
                v-if="desktop === false"
                class="text-textSubheading py-2 md:px-1 px-4 m-1 ml-4 text-textSubheading text-sm rounded-lg bg-Dark hover:bg-white hover:text-Dark border border-Dark"
                :href="metamaskLink"
              >
                Metamask
              </a>
              <a
                v-if="desktop === true"
                class="text-textSubheading py-2 md:px-1 px-4 text-textSubheading text-sm rounded-lg bg-Dark hover:bg-white hover:text-Dark border border-Dark cursor-pointer"
                @click="desktop = false"
              >
                close
              </a>
            </div>
          </div>
        </div>
      </div>
      <p class="text-textSubheading titleStyle">{{ title }}</p>
      <p class="text-textSubheading text-textSubheading subTitleStyle p-1">
        {{ totalSupply }} minted / {{ maxSupply }} total
      </p>

      <div class="flex flex-row align-between px-4 pt-4">
        <div class="text-textSubheading">{{ $t('balanceLabel') }}</div>
        <div class="text-textSubheading">{{ mintsCount }}</div>
      </div>

      <div class="flex flex-row align-between items-center p-4">
        <div class="text-textSubheading mr-4">{{ $t('amount') }}</div>

        <div class="flex flex-row items-center">
          <div
            class="font-bold"
            :class="
              amount <= 0 || isWhitelistActive === false
                ? 'fontStyleDisabled'
                : 'fontStyle'
            "
            :style="
              amount <= 0 || isWhitelistActive === false
                ? 'color: Silver; cursor: default'
                : 'color: white; cursor: pointer'
            "
            @click="amount > 0 ? (amount = amount - 1) : {}"
          >
            -
          </div>
          <!--          <input v-model="amount" class="bg-transparent text-textSubheading amountInputStyle" type="number"/>-->
          <div class="text-textSubheading fontStyle font-bold pl-4 pr-4">
            {{ amount }}
          </div>
          <div
            :class="
              amount >=
                Math.min(
                  maxBuyPerAddress - mintsCount,
                  maxSupply - totalSupply,
                ) || isWhitelistActive === false
                ? 'fontStyleDisabled'
                : 'fontStyle'
            "
            :style="
              amount >=
                Math.min(
                  maxBuyPerAddress - mintsCount,
                  maxSupply - totalSupply,
                ) || isWhitelistActive === false
                ? 'color: Silver; cursor: default'
                : 'color: white; cursor: pointer'
            "
            @click="
              amount <
              Math.min(maxBuyPerAddress - mintsCount, maxSupply - totalSupply)
                ? (amount = amount + 1)
                : {}
            "
          >
            +
          </div>
          <button
            class="py-2 maxStyle md:px-1 px-4 m-1 ml-4 text-sm rounded-lg text-textSubheading bg-buttonInActiveColor hover:bg-buttonActiveColor hover:text-buttonActiveTextColor"
            @click="getMaxAmount"
          >
            Max
          </button>
        </div>
      </div>

      <div class="flex flex-row align-between px-4">
        <label class="text-textSubheading">{{ $t('tokenTotal') }}</label>
        <div class="text-textSubheading cursor-pointer">
          {{ total / Math.pow(10, 18) }} ETH
        </div>
      </div>

      <div class="flex flex-row items-center align-between px-4">
        <label class="text-textSubheading">{{ $t('pay') }}</label>
        <div class="flex">
          <input
            v-model="payPrice"
            class="p-2 py-3 font-sm mr-2.5 appearance-none block text-white bg-transparent border border-gray-200 rounded-xl w-100px leading-tight focus:outline-none focus:bg-transparent text-sm focus:border-gray-500"
            type="text"
            @keypress="isNumber($event)"
          />
          <div class="text-textSubheading">ETH</div>
        </div>
      </div>

      <div class="flex flex-row align-between px-4">
        <label class="text-textSubheading">{{ $t('total') }}</label>
        <div class="text-textSubheading cursor-pointer">
          {{ totalOverall / Math.pow(10, 18) }} ETH
        </div>
      </div>

      <div>
        <button
          v-if="
            connected &&
            parseInt(mintsCount) < parseInt(maxBuyPerAddress) &&
            parseInt(totalSupply) < parseInt(maxSupply) &&
            isWhitelistActive === true &&
            isContractPaused === false
          "
          class="h-53px py-3 md:px-8 mr-4 px-4 m-1 text-sm rounded-full"
          :class="submitButtonStyle"
          :style="
            processing === true
              ? 'background-color: Silver'
              : 'background-color: black'
          "
          @click="callMintFunction"
        >
          <div v-if="processing === true">
            <img :src="require('assets/icons/loadingCircle.svg')" width="35" />
          </div>
          <div v-else>Whitelist Mint</div>
        </button>
        <button
          v-else-if="
            connected &&
            (isWhitelistActive === false || isContractPaused === true)
          "
          class="h-53px py-3 md:px-8 mr-4 px-4 m-1 text-sm text-textSubheading rounded-full"
          :class="submitButtonStyle"
          @click="() => {}"
        >
          Unavailable
        </button>
        <button
          v-else-if="
            connected &&
            (!(parseInt(mintsCount) < parseInt(maxBuyPerAddress)) ||
              !(parseInt(totalSupply) < parseInt(maxSupply)))
          "
          class="h-53px py-3 md:px-8 mr-4 px-4 m-1 text-sm rounded-full"
          :class="submitButtonStyle"
          @click="() => {}"
        >
          Unavailable
        </button>
        <button
          v-else-if="!connected"
          class="h-53px py-3 md:px-8 mr-4 px-4 m-1 text-sm rounded-full"
          :class="submitButtonStyle"
          @click="initMetamask"
        >
          Connect
        </button>
        <p
          v-if="
            connected &&
            (!(parseInt(mintsCount) < parseInt(maxBuyPerAddress)) ||
              !(parseInt(totalSupply) < parseInt(maxSupply)))
          "
          class="italic text-textSubheading w-400px"
        >
          No more NFTs available to mint
        </p>
        <p
          v-if="connected && isWhitelistActive === false"
          class="italic text-textSubheading w-400px"
        >
          Whitelist mint is not open, come back later
        </p>
        <p
          v-if="connected && isContractPaused === true"
          class="italic text-textSubheading w-400px"
        >
          Contract is paused, come back later
        </p>
      </div>

      <p class="text-textSubheading w-400px">{{ errorMessage }}</p>
      <p class="text-textSubheading">{{ successMessage }}</p>
    </div>

    <div
      v-if="
        (section.settings.image &&
          section.settings.image.files &&
          section.settings.image.files[0].url !== '') ||
        (section.settings.image &&
          section.settings.image.length > 0 &&
          section.settings.image[0] &&
          section.settings.image[0].url !== '') ||
        (section.settings.image_description &&
          section.settings.image_description !== '')
      "
      class="imageStyle"
    >
      <img
        v-if="section.settings.image && section.settings.image.files"
        :src="section.settings.image.files[0].url"
      />
      <img
        v-else-if="
          section.settings.image &&
          section.settings.image.length > 0 &&
          section.settings.image[0]
        "
        :src="section.settings.image[0].url"
      />
      <div
        class="descStyle ql-editor ql-snow"
        v-html="section.settings.image_description"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'NftMintWhitelistTestConfigurable',
  props: {
    section: {
      type: Object,
      // eslint-disable-next-line vue/require-valid-default-prop
      default: {},
    },
    lang: {
      type: String,
      default: 'en',
    },
  },
  data() {
    return {
      web3: {
        networkId: '',
        coinbase: '',
        type: '',
        balance: '',
      },
      amount: 0,
      payPriceErrorMessage: this.$t('payPriceError'),
      errorMessage: '',
      successMessage: '',
      connected: false,
      totalSupply: '',
      maxSupply: '',
      maxPerTx: '',
      maxBuyPerAddress: '',
      isWhitelistActive: '',
      isContractPaused: '',
      freePerAddress: '',
      mintsCount: '',
      price: 0,
      formUpdated: this.section.settings,
      processing: false,
      mobile: false,
      desktop: false,
      metamaskLink: '',
      tokenID: 1,
      submitButtonStyle:
        'text-textSubheading bg-buttonInActiveColor hover:bg-buttonActiveColor hover:text-buttonActiveTextColor',
      payPrice: null,
      isWhitelist: false,
      whitelistServerUrl: 'https://w3wl.geeks.solutions/api',
    }
  },
  computed: {
    show() {
      return !!this.section.settings
    },
    title() {
      return this.section.settings.title
    },
    total() {
      return Number(this.price)
    },
    totalOverall() {
      return this.payPrice
        ? this.total + Number(this.payPrice) * Math.pow(10, 18)
        : this.total
    },
    contractAddr() {
      return this.section.settings.contract_addr
    },
    contractABI() {
      return this.section.settings.contract_abi
    },
    maxPerTxFunctionName() {
      return this.section.settings.maxPerTx
    },
    priceFunctionName() {
      return ''
    },
    freePerAddressFunctionName() {
      return this.section.settings.freePerAddress
    },
    tokenType() {
      return 'Erc1155'
    },
    whitelistId() {
      if (this.section.settings && this.section.settings.whitelist_id) {
        return this.section.settings.whitelist_id
      } else return null
    },
  },
  watch: {
    section() {
      this.initContract()
    },
    amount() {
      this.getTotalPrice()
    },
  },
  mounted() {
    if (this.whitelistId) {
      this.isWhitelist = true
    }
    if (window.web3) {
      window.ethereum.on('accountsChanged', (accounts) => {
        this.$refs.metamask.Log()
      })
      if (window.web3.currentProvider.selectedAddress) {
        this.initMetamask()
      }
    }

    if (!this.$nuxt._events.connectMetamask)
      this.$nuxt.$on('connectMetamask', this.initMetamask)

    if (!this.$nuxt._events.customTransaction)
      this.$nuxt.$on('customTransaction', this.callCustomMethod)
  },
  methods: {
    initMetamask() {
      if (window.web3) {
        this.$refs.metamask.init()
      } else {
        const userAgent =
          navigator.userAgent || navigator.vendor || window.opera
        if (/android/i.test(userAgent)) {
          this.mobile = true
          this.metamaskLink =
            'https://play.google.com/store/apps/details?id=io.metamask&hl=en&gl=US'
        } else if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
          this.mobile = true
          this.metamaskLink =
            'https://apps.apple.com/us/app/metamask-blockchain-wallet/id1438144202'
        } else {
          this.desktop = true
        }
      }
    },
    initContract() {
      if (window.web3 && window.web3.eth) {
        try {
          const contractAddress = this.contractAddr
          const nftContract = new this.$refs.metamask.web3.eth.Contract(
            JSON.parse(this.contractABI),
            contractAddress,
          )
          const options = {
            filter: {
              value: [],
            },
            fromBlock: 0,
          }

          if (this.tokenType === 'Erc1155') {
            nftContract.once('TransferSingle', options, () => {
              this.$refs.metamask.Log()
            })
            if (this.isWhitelist) {
              nftContract.methods
                .initFront(
                  this.web3.coinbase,
                  this.section.render_data[0].data.token_id,
                  this.section.render_data[0].data.index,
                )
                .call()
                .then((res) => {
                  this.totalSupply = parseInt(res.total_supply)
                  this.isContractPaused = res.isPaused
                  this.isWhitelistActive = res.active
                  this.mintsCount = parseInt(res.mints_count)
                  this.maxSupply = parseInt(res.max_supply)
                  this.maxBuyPerAddress = parseInt(res.max_per_wallet)
                })
            }
          }
        } catch (e) {
          this.errorMessage = e
        }
      }
    },
    getTotalPrice() {
      try {
        const contractAddress = this.contractAddr
        const nftContract = new this.$refs.metamask.web3.eth.Contract(
          JSON.parse(this.contractABI),
          contractAddress,
        )
        if (this.tokenType === 'Erc1155') {
          if (this.isWhitelist) {
            nftContract.methods
              .getMintTotalPrice(
                this.web3.coinbase,
                this.section.render_data[0].data.token_id,
                this.section.render_data[0].data.index,
                this.amount,
              )
              .call()
              .then((res) => {
                this.price = res
              })
          }
        }
      } catch (e) {
        this.errorMessage = e
      }
    },
    async callMintFunction() {
      this.processing = true
      this.successMessage = ``
      const contractAddress = this.contractAddr
      const nftContract = new this.$refs.metamask.web3.eth.Contract(
        JSON.parse(this.contractABI),
        contractAddress,
      )
      const nonce = await this.$refs.metamask.web3.eth.getTransactionCount(
        this.web3.coinbase,
        'latest',
      ) // get latest nonce

      if (!this.amount) {
        this.errorMessage = 'Please provide a valid amount'
        this.processing = false
      } else if (this.amount > this.maxSupply - this.totalSupply) {
        this.errorMessage = `Only ${this.maxSupply - this.totalSupply} tokens left to mint`
        this.processing = false
      } else if (
        parseInt(this.mintsCount) + this.amount >
        parseInt(this.maxBuyPerAddress)
      ) {
        this.errorMessage = `You are allowed to mint ${this.maxBuyPerAddress - this.mintsCount} tokens with this wallet`
        this.processing = false
      } else if (
        parseFloat(this.web3.balance) / Math.pow(10, 18) <=
        this.totalOverall / Math.pow(10, 18)
      ) {
        this.errorMessage = `You do not have sufficient ETH in your wallet to proceed`
        this.processing = false
      } else if (this.isWhitelist) {
        this.getProof()
          .then((response) => {
            if (response.data.proof) {
              this.loading = true
              this.errorMessage = ''
              this.successMessage = ''
              // the transaction
              const tx = {
                from: this.web3.coinbase,
                to: contractAddress,
                nonce,
                value: this.totalOverall, // There are 10^18 wei in a single Ether
                data: nftContract.methods
                  .wlMint(
                    this.section.render_data[0].data.token_id,
                    this.section.render_data[0].data.index,
                    this.amount,
                    response.data.proof,
                  )
                  .encodeABI(),
              }

              this.$refs.metamask.web3.eth
                .sendTransaction(tx)
                .then((txHash) => {
                  this.loading = false
                  this.initMetamask()
                  this.initContract()
                  this.successMessage = `Transaction succeeded`
                  this.processing = false
                  this.getTotalPrice()
                })
                .catch((error) => {
                  this.processing = false
                  this.loading = false

                  console.warn(error.message)
                  this.errorMessage =
                    'An error occurred, check you metamask wallet for details'
                })
            } else {
              this.processing = false
              this.loading = false
              this.errorMessage = response.data.error
            }
          })
          .catch((error) => {
            this.errorMessage = error
          })
      }
    },
    async callCustomMethod(parameters) {
      let contractAddress
      let nftContract
      if (!parameters.secondaryContractId) {
        contractAddress = this.contractAddr
        nftContract = new this.$refs.metamask.web3.eth.Contract(
          JSON.parse(this.contractABI),
          contractAddress,
        )
      } else if (
        this.section.settings.secondary_contracts[
          parameters.secondaryContractId
        ]
      ) {
        contractAddress =
          this.section.settings.secondary_contracts[
            parameters.secondaryContractId
          ].contract_address
        nftContract = new this.$refs.metamask.web3.eth.Contract(
          JSON.parse(
            this.section.settings.secondary_contracts[
              parameters.secondaryContractId
            ].contract_abi,
          ),
          contractAddress,
        )
      } else {
        console.error('Contract ID not found')
      }

      const nonce = await this.$refs.metamask.web3.eth.getTransactionCount(
        this.web3.coinbase,
        'latest',
      ) // get latest nonce

      // the transaction
      const tx = {
        from: this.web3.coinbase,
        to: contractAddress,
        nonce,
        value: this.totalOverall,
        data: nftContract.methods[parameters.methodName](
          ...parameters.params,
        ).encodeABI(),
      }

      this.$refs.metamask.web3.eth
        .sendTransaction(tx)
        .then((txHash) => {
          this.initMetamask()
          this.initContract()
          this.$nuxt.$emit('transactionResponse', {
            status: 'Success',
            message: 'Transaction succeeded',
          })
        })
        .catch((error) => {
          console.warn(error.message)
          this.$nuxt.$emit('transactionResponse', {
            status: 'Error',
            message: 'An error occurred, check you metamask wallet for details',
          })
        })
    },
    async onComplete(data) {
      if (
        data &&
        data.web3 &&
        data.type !== 'NO_LOGIN' &&
        data.type !== 'USER_DENIED_ACCOUNT_AUTHORIZATION'
      ) {
        await data.web3.eth.getBalance(data.metaMaskAddress).then((res) => {
          this.web3.balance = res
          this.web3.networkId = data.netID
          this.web3.coinbase = data.metaMaskAddress
          this.web3.type = data.type
          this.connected = true
          if (this.section.settings) {
            this.connected = true
            this.initContract()
          }
        })
      } else {
        this.connected = false
        location.reload()
      }
    },
    getMaxAmount() {
      this.amount = Math.min(
        this.maxBuyPerAddress - this.mintsCount,
        this.maxSupply - this.totalSupply,
      )
    },
    async getProof() {
      const URL = this.whitelistServerUrl
      return await this.$axios
        .get(
          URL +
            `/proof/${this.section.settings.whitelist_id}/${this.web3.coinbase}`,
          {},
        )
        .catch((error) => {
          return error
        })
    },
    isNumber(evt) {
      evt = evt || window.event
      const charCode = evt.which ? evt.which : evt.keyCode
      if (
        charCode > 31 &&
        (charCode < 48 || charCode > 57) &&
        charCode !== 46
      ) {
        evt.preventDefault()
      } else {
        return true
      }
    },
  },
}
</script>

<style lang="css" scoped>
.maxStyle {
  padding: 10px !important;
}
.align-between {
  justify-content: space-between;
}
.blockStyle {
  background-color: #71bd95;
  margin-left: 7%;
  padding: 20px;
  border-radius: 25px;
  height: fit-content;
}
.amountInputStyle {
  text-align: center;
  width: 60px;
}
.titleStyle {
  font-size: 1.5vw;
  font-weight: bold;
}
.subTitleStyle {
  font-size: 1vw;
  font-weight: lighter;
  color: #7f7f7f;
}
.rowStyle {
  align-items: center;
  justify-content: space-around;
  display: flex;
  margin-bottom: 2% !important;
}
.fontStyle {
  font-size: 30px;
  color: #c10100 !important;
}
.fontStyleDisabled {
  font-size: 30px;
  color: grey !important;
}
div {
  font-size: 1.5vw;
}
p {
  font-size: 1.5vw;
}
button {
  font-size: 1.5vw !important;
}
.descStyle {
  color: #c10100;
  width: 65vh;
}
.imageStyle {
  text-align: -webkit-center;
  padding: 0% 7% 0% 5%;
}
@media only screen and (max-width: 600px) {
  .rowStyle {
    text-align: -webkit-center !important;
    display: block;
  }
  .blockStyle {
    background-color: #71bd95;
    margin: 5px;
    padding: 20px;
    border-radius: 25px;
  }
  .titleStyle {
    font-size: 4vw;
    font-weight: bold;
  }
  .subTitleStyle {
    font-size: 3vw;
    font-weight: lighter;
    color: #7f7f7f;
  }
  div {
    font-size: 4vw;
  }
  p {
    font-size: 4vw;
  }
  button {
    font-size: 4vw !important;
  }
  .imageStyle {
    text-align: -webkit-center;
    padding: 5% 7% 10% 5%;
  }
  .descStyle {
    width: 38vh;
  }
}
</style>
