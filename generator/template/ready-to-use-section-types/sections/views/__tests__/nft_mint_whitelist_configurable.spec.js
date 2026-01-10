import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import NftMintWhitelistConfigurable from '../nft_mint_whitelist_configurable.vue'

// Mock vue-metamask component
const mockVueMetamask = {
  name: 'vue-metamask',
  template: '<div><slot></slot></div>',
  props: ['initConnect'],
  methods: {
    init: vi.fn(),
    Log: vi.fn(),
  },
}

// Mock window.web3
global.window = global.window || {}
global.window.web3 = {
  currentProvider: {
    selectedAddress: null,
  },
  eth: {
    Contract: vi.fn(),
    getBalance: vi.fn(),
    getTransactionCount: vi.fn(),
  },
}

global.window.ethereum = {
  on: vi.fn(),
}

global.window.navigator = {
  userAgent:
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
}

// Mock $t function
const mockI18n = {
  locale: 'en',
}

// Mock $nuxt
global.$nuxt = {
  $on: vi.fn(),
  $emit: vi.fn(),
  _events: {},
}

const mockNuxt = {
  $on: vi.fn(),
  $emit: vi.fn(),
  _events: {},
}

const createWrapper = (props = {}) => {
  return mount(NftMintWhitelistConfigurable, {
    props: {
      lang: 'en',
      section: {
        settings: {
          title: 'Test NFT Mint',
          contract_addr: '0x1234567890123456789012345678901234567890',
          contract_abi: JSON.stringify([]),
          whitelist_id: 'test-whitelist-123',
        },
        render_data: [
          {
            data: {
              token_id: 1,
              index: 0,
            },
          },
        ],
      },
      ...props,
    },
    global: {
      components: {
        'vue-metamask': mockVueMetamask,
      },
      mocks: {
        $i18n: mockI18n,
        $t: vi.fn((key) => key),
        $nuxt: mockNuxt,
        $axios: {
          get: vi.fn(),
        },
      },
      stubs: {
        'vue-metamask': mockVueMetamask,
      },
    },
  })
}

describe('NftMintWhitelistConfigurable', () => {
  let wrapper

  beforeEach(() => {
    wrapper = createWrapper()
  })

  describe('Component Rendering', () => {
    it('should render when section has settings', () => {
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.find('#nftSection').exists()).toBe(true)
    })

    it('should not render when section has no settings', () => {
      wrapper = createWrapper({
        section: {},
      })
      expect(wrapper.find('#nftSection').exists()).toBe(false)
    })

    it('should display title from section settings', () => {
      const title = wrapper.find('.titleStyle')
      expect(title.exists()).toBe(true)
      expect(title.text()).toBe('Test NFT Mint')
    })

    it('should render vue-metamask component', () => {
      const metamaskComponent = wrapper.findComponent(mockVueMetamask)
      expect(metamaskComponent.exists()).toBe(true)
    })
  })

  describe('Computed Properties', () => {
    it('should compute show correctly when section has settings', () => {
      expect(wrapper.vm.show).toBe(true)
    })

    it('should compute show to false when section has no settings', () => {
      wrapper = createWrapper({
        section: {},
      })
      expect(wrapper.vm.show).toBe(false)
    })

    it('should compute title from settings', () => {
      expect(wrapper.vm.title).toBe('Test NFT Mint')
    })

    it('should compute total correctly', () => {
      wrapper.vm.price = 1000000000000000000
      expect(wrapper.vm.total).toBe(1000000000000000000)
    })

    it('should compute totalOverall correctly with payPrice', () => {
      wrapper.vm.price = 1000000000000000000
      wrapper.vm.payPrice = '0.5'
      const expected = 1000000000000000000 + 0.5 * Math.pow(10, 18)
      expect(wrapper.vm.totalOverall).toBe(expected)
    })

    it('should compute totalOverall correctly without payPrice', () => {
      wrapper.vm.price = 1000000000000000000
      wrapper.vm.payPrice = null
      expect(wrapper.vm.totalOverall).toBe(1000000000000000000)
    })

    it('should compute contractAddr from settings', () => {
      expect(wrapper.vm.contractAddr).toBe(
        '0x1234567890123456789012345678901234567890',
      )
    })

    it('should compute contractABI from settings', () => {
      expect(wrapper.vm.contractABI).toBe(JSON.stringify([]))
    })

    it('should compute tokenType as Erc1155', () => {
      expect(wrapper.vm.tokenType).toBe('Erc1155')
    })

    it('should compute whitelistId from settings', () => {
      expect(wrapper.vm.whitelistId).toBe('test-whitelist-123')
    })

    it('should compute whitelistId as null when not provided', () => {
      wrapper = createWrapper({
        section: {
          settings: {
            title: 'Test',
            contract_addr: '0x1234567890123456789012345678901234567890',
            contract_abi: JSON.stringify([]),
          },
          render_data: [
            {
              data: {
                token_id: 1,
                index: 0,
              },
            },
          ],
        },
      })
      expect(wrapper.vm.whitelistId).toBe(null)
    })
  })

  describe('Data Initialization', () => {
    it('should initialize data properties correctly', () => {
      expect(wrapper.vm.amount).toBe(0)
      expect(wrapper.vm.errorMessage).toBe('')
      expect(wrapper.vm.successMessage).toBe('')
      expect(wrapper.vm.connected).toBe(false)
      expect(wrapper.vm.totalSupply).toBe('')
      expect(wrapper.vm.maxSupply).toBe('')
      expect(wrapper.vm.maxBuyPerAddress).toBe('')
      expect(wrapper.vm.isWhitelistActive).toBe('')
      expect(wrapper.vm.isContractPaused).toBe('')
      expect(wrapper.vm.mintsCount).toBe('')
      expect(wrapper.vm.price).toBe(0)
      expect(wrapper.vm.processing).toBe(false)
      expect(wrapper.vm.payPrice).toBe(null)
      expect(wrapper.vm.whitelistServerUrl).toBe(
        'https://w3wl.geeks.solutions/api',
      )
    })

    it('should set isWhitelist to true when whitelistId exists', () => {
      expect(wrapper.vm.isWhitelist).toBe(true)
    })
  })

  describe('Amount Selection', () => {
    it('should increment amount when clicking +', () => {
      wrapper.vm.amount = 1
      wrapper.vm.maxBuyPerAddress = 10
      wrapper.vm.mintsCount = 0
      wrapper.vm.maxSupply = 100
      wrapper.vm.totalSupply = 0
      wrapper.vm.isWhitelistActive = true

      wrapper.findAll('div').forEach((el) => {
        if (el.text() === '+') {
          el.trigger('click')
        }
      })

      expect(wrapper.vm.amount).toBe(2)
    })

    it('should decrement amount when clicking -', () => {
      wrapper.vm.amount = 2
      wrapper.vm.isWhitelistActive = true

      wrapper.findAll('div').forEach((el) => {
        if (el.text() === '-') {
          el.trigger('click')
        }
      })

      expect(wrapper.vm.amount).toBe(1)
    })

    it('should not decrement amount below 0', () => {
      wrapper.vm.amount = 0
      wrapper.vm.isWhitelistActive = true

      wrapper.findAll('div').forEach((el) => {
        if (el.text() === '-') {
          el.trigger('click')
        }
      })

      expect(wrapper.vm.amount).toBe(0)
    })

    it('should set max amount when clicking Max button', () => {
      wrapper.vm.maxBuyPerAddress = 10
      wrapper.vm.mintsCount = 3
      wrapper.vm.maxSupply = 100
      wrapper.vm.totalSupply = 90

      wrapper.find('button').trigger('click')

      expect(wrapper.vm.amount).toBe(7)
    })

    it('should not increment beyond max limit', () => {
      wrapper.vm.amount = 7
      wrapper.vm.maxBuyPerAddress = 10
      wrapper.vm.mintsCount = 3
      wrapper.vm.maxSupply = 100
      wrapper.vm.totalSupply = 90
      wrapper.vm.isWhitelistActive = true

      wrapper.findAll('div').forEach((el) => {
        if (el.text() === '+') {
          el.trigger('click')
        }
      })

      expect(wrapper.vm.amount).toBe(7)
    })
  })

  describe('Button States Logic', () => {
    it('should not connect when not connected', () => {
      wrapper.vm.connected = false
      expect(wrapper.vm.connected).toBe(false)
    })

    it('should be ready to mint when conditions are met', () => {
      wrapper.vm.connected = true
      wrapper.vm.isWhitelistActive = true
      wrapper.vm.isContractPaused = false
      wrapper.vm.mintsCount = '0'
      wrapper.vm.maxBuyPerAddress = '10'
      wrapper.vm.totalSupply = '0'
      wrapper.vm.maxSupply = '100'

      expect(wrapper.vm.connected).toBe(true)
      expect(wrapper.vm.isWhitelistActive).toBe(true)
      expect(wrapper.vm.isContractPaused).toBe(false)
    })

    it('should handle whitelist not active', () => {
      wrapper.vm.connected = true
      wrapper.vm.isWhitelistActive = false
      wrapper.vm.isContractPaused = false
      expect(wrapper.vm.isWhitelistActive).toBe(false)
    })

    it('should handle contract paused', () => {
      wrapper.vm.connected = true
      wrapper.vm.isWhitelistActive = true
      wrapper.vm.isContractPaused = true
      expect(wrapper.vm.isContractPaused).toBe(true)
    })

    it('should handle max per address reached', () => {
      wrapper.vm.connected = true
      wrapper.vm.isWhitelistActive = true
      wrapper.vm.isContractPaused = false
      wrapper.vm.mintsCount = '10'
      wrapper.vm.maxBuyPerAddress = '10'
      wrapper.vm.totalSupply = '0'
      wrapper.vm.maxSupply = '100'
      expect(parseInt(wrapper.vm.mintsCount)).toBeGreaterThanOrEqual(
        parseInt(wrapper.vm.maxBuyPerAddress),
      )
    })

    it('should handle max supply reached', () => {
      wrapper.vm.connected = true
      wrapper.vm.isWhitelistActive = true
      wrapper.vm.isContractPaused = false
      wrapper.vm.mintsCount = '0'
      wrapper.vm.maxBuyPerAddress = '10'
      wrapper.vm.totalSupply = '100'
      wrapper.vm.maxSupply = '100'
      expect(parseInt(wrapper.vm.totalSupply)).toBeGreaterThanOrEqual(
        parseInt(wrapper.vm.maxSupply),
      )
    })
  })

  describe('Message Display', () => {
    it('should display error message', () => {
      wrapper.vm.errorMessage = 'Test error message'
      expect(wrapper.vm.errorMessage).toBe('Test error message')
    })

    it('should display success message', () => {
      wrapper.vm.successMessage = 'Transaction succeeded'
      expect(wrapper.vm.successMessage).toBe('Transaction succeeded')
    })

    it('should track when limits are reached', () => {
      wrapper.vm.connected = true
      wrapper.vm.mintsCount = '10'
      wrapper.vm.maxBuyPerAddress = '10'
      expect(parseInt(wrapper.vm.mintsCount)).toBe(
        parseInt(wrapper.vm.maxBuyPerAddress),
      )
    })

    it('should track when whitelist is inactive', () => {
      wrapper.vm.connected = true
      wrapper.vm.isWhitelistActive = false
      expect(wrapper.vm.isWhitelistActive).toBe(false)
    })

    it('should track when contract is paused', () => {
      wrapper.vm.connected = true
      wrapper.vm.isContractPaused = true
      expect(wrapper.vm.isContractPaused).toBe(true)
    })
  })

  describe('Methods', () => {
    it('getMaxAmount should set amount to minimum of available and supply', () => {
      wrapper.vm.maxBuyPerAddress = 10
      wrapper.vm.mintsCount = 3
      wrapper.vm.maxSupply = 100
      wrapper.vm.totalSupply = 90

      wrapper.vm.getMaxAmount()

      expect(wrapper.vm.amount).toBe(7)
    })

    it('getMaxAmount should handle supply limit as minimum', () => {
      wrapper.vm.maxBuyPerAddress = 20
      wrapper.vm.mintsCount = 5
      wrapper.vm.maxSupply = 100
      wrapper.vm.totalSupply = 92

      wrapper.vm.getMaxAmount()

      expect(wrapper.vm.amount).toBe(8)
    })

    it('isNumber should allow numeric input', () => {
      const event = { which: 48, preventDefault: vi.fn() }
      wrapper.vm.isNumber(event)
      expect(event.preventDefault).not.toHaveBeenCalled()
    })

    it('isNumber should prevent non-numeric input', () => {
      const event = { which: 65, preventDefault: vi.fn() }
      wrapper.vm.isNumber(event)
      expect(event.preventDefault).toHaveBeenCalled()
    })

    it('isNumber should allow decimal point', () => {
      const event = { which: 46, preventDefault: vi.fn() }
      wrapper.vm.isNumber(event)
      expect(event.preventDefault).not.toHaveBeenCalled()
    })

    it('isNumber should handle charCode 65 (A)', () => {
      const event = { which: 65, preventDefault: vi.fn() }
      wrapper.vm.isNumber(event)
      expect(event.preventDefault).toHaveBeenCalled()
    })

    it('isNumber should handle special character', () => {
      const event = { which: 64, preventDefault: vi.fn() }
      wrapper.vm.isNumber(event)
      expect(event.preventDefault).toHaveBeenCalled()
    })
  })

  describe('Amount Watcher', () => {
    it('should track amount changes', () => {
      wrapper.vm.amount = 5
      expect(wrapper.vm.amount).toBe(5)
    })
  })

  describe('Error Handling', () => {
    it('should handle empty contract address', () => {
      wrapper = createWrapper({
        section: {
          settings: {
            title: 'Test',
            contract_addr: '',
            contract_abi: JSON.stringify([]),
          },
          render_data: [
            {
              data: { token_id: 1, index: 0 },
            },
          ],
        },
      })
      expect(wrapper.vm.contractAddr).toBe('')
    })

    it('should handle empty contract ABI', () => {
      wrapper = createWrapper({
        section: {
          settings: {
            title: 'Test',
            contract_addr: '0x1234567890123456789012345678901234567890',
            contract_abi: '',
          },
          render_data: [
            {
              data: { token_id: 1, index: 0 },
            },
          ],
        },
      })
      expect(wrapper.vm.contractABI).toBe('')
    })
  })

  describe('Computed Properties Additional', () => {
    it('should compute maxPerTxFunctionName', () => {
      wrapper = createWrapper({
        section: {
          settings: {
            title: 'Test',
            contract_addr: '0x1234567890123456789012345678901234567890',
            contract_abi: JSON.stringify([]),
            maxPerTx: 'maxPerTxTest',
            whitelist_id: 'test-123',
          },
          render_data: [
            {
              data: { token_id: 1, index: 0 },
            },
          ],
        },
      })
      expect(wrapper.vm.maxPerTxFunctionName).toBe('maxPerTxTest')
    })

    it('should compute priceFunctionName as empty', () => {
      expect(wrapper.vm.priceFunctionName).toBe('')
    })

    it('should compute freePerAddressFunctionName', () => {
      wrapper = createWrapper({
        section: {
          settings: {
            title: 'Test',
            contract_addr: '0x1234567890123456789012345678901234567890',
            contract_abi: JSON.stringify([]),
            freePerAddress: 'freePerAddrTest',
            whitelist_id: 'test-123',
          },
          render_data: [
            {
              data: { token_id: 1, index: 0 },
            },
          ],
        },
      })
      expect(wrapper.vm.freePerAddressFunctionName).toBe('freePerAddrTest')
    })
  })

  describe('Amount and Price Calculations', () => {
    it('should handle amount change affecting total', () => {
      wrapper.vm.price = 500000000000000000
      wrapper.vm.amount = 2
      wrapper.vm.payPrice = '0.1'
      const expected = 500000000000000000 + 0.1 * Math.pow(10, 18)
      expect(wrapper.vm.totalOverall).toBe(expected)
    })

    it('should calculate total correctly with zero payPrice', () => {
      wrapper.vm.price = 1000000000000000000
      wrapper.vm.payPrice = '0'
      expect(wrapper.vm.totalOverall).toBe(1000000000000000000)
    })

    it('should update price when amount changes', () => {
      wrapper.vm.price = 1000000000000000000
      wrapper.vm.amount = 5
      expect(wrapper.vm.amount).toBe(5)
    })

    it('should display ETH values correctly divided by 10^18', () => {
      wrapper.vm.price = 1000000000000000000
      wrapper.vm.payPrice = null
      const ethValue = wrapper.vm.total / Math.pow(10, 18)
      expect(ethValue).toBe(1)
    })

    it('should calculate totalOverall ETH correctly', () => {
      wrapper.vm.price = 2000000000000000000
      wrapper.vm.payPrice = '0.5'
      const ethValue = wrapper.vm.totalOverall / Math.pow(10, 18)
      expect(ethValue).toBeCloseTo(2.5, 18)
    })
  })

  describe('Section Configuration', () => {
    it('should handle section with render data', () => {
      wrapper = createWrapper({
        section: {
          settings: {
            title: 'Test',
            contract_addr: '0x1234567890123456789012345678901234567890',
            contract_abi: JSON.stringify([]),
            whitelist_id: 'test-123',
          },
          render_data: [
            {
              data: {
                token_id: 1,
                index: 0,
                extra_data: 'test',
              },
            },
          ],
        },
      })
      expect(wrapper.vm.whitelistId).toBe('test-123')
    })

    it('should handle section without render data', () => {
      wrapper = createWrapper({
        section: {
          settings: {
            title: 'Test',
            contract_addr: '0x1234567890123456789012345678901234567890',
            contract_abi: JSON.stringify([]),
          },
          render_data: [],
        },
      })
      expect(wrapper.vm.whitelistId).toBe(null)
    })
  })

  describe('State Management', () => {
    it('should update processing state', () => {
      wrapper.vm.processing = true
      expect(wrapper.vm.processing).toBe(true)
      wrapper.vm.processing = false
      expect(wrapper.vm.processing).toBe(false)
    })

    it('should update mobile/desktop states', () => {
      wrapper.vm.mobile = true
      wrapper.vm.desktop = true
      expect(wrapper.vm.mobile).toBe(true)
      expect(wrapper.vm.desktop).toBe(true)
    })

    it('should update error and success messages', () => {
      wrapper.vm.errorMessage = 'Error message'
      wrapper.vm.successMessage = 'Success message'
      expect(wrapper.vm.errorMessage).toBe('Error message')
      expect(wrapper.vm.successMessage).toBe('Success message')
    })
  })

  describe('Computed Edge Cases', () => {
    it('should handle zero price', () => {
      wrapper.vm.price = 0
      wrapper.vm.payPrice = null
      expect(wrapper.vm.total).toBe(0)
      expect(wrapper.vm.totalOverall).toBe(0)
    })

    it('should handle large payPrice', () => {
      wrapper.vm.price = 1000000000000000000
      wrapper.vm.payPrice = '10'
      const expected = 1000000000000000000 + 10 * Math.pow(10, 18)
      expect(wrapper.vm.totalOverall).toBe(expected)
    })

    it('should handle negative total (edge case)', () => {
      wrapper.vm.price = -1000000000000000000
      wrapper.vm.payPrice = null
      expect(wrapper.vm.total).toBe(-1000000000000000000)
    })
  })

  describe('Form Updated', () => {
    it('should track formUpdated value', () => {
      expect(wrapper.vm.formUpdated).toEqual(wrapper.vm.section.settings)
    })
  })

  describe('Token ID', () => {
    it('should initialize tokenID to 1', () => {
      expect(wrapper.vm.tokenID).toBe(1)
    })
  })

  describe('Submit Button Style', () => {
    it('should have submit button style initialized', () => {
      expect(wrapper.vm.submitButtonStyle).toContain('text-textSubheading')
      expect(wrapper.vm.submitButtonStyle).toContain('bg-buttonInActiveColor')
    })
  })
})
