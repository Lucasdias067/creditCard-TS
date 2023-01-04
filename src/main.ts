import "./css/index.css"
import IMask from "imask"

const ccBgColor01 = document.querySelector(".cc-bg svg > g g:nth-child(1) path")
const ccBgColor02 = document.querySelector(".cc-bg svg > g g:nth-child(2) path")
const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img")

const colors = {
  visa: ["#436D99", "#2D57F2"],
  mastercard: ["#DF6F29", "#C69347"],
  default: ["black", "gray"],
}

function setCardType(type: string) {
  ccBgColor01?.setAttribute("fill", colors[type][0])
  ccBgColor02?.setAttribute("fill", colors[type][0])
  ccLogo?.setAttribute("src", `cc-${type}.svg`)
}

globalThis.setCardType = setCardType

const securityCode = <HTMLElement>document.querySelector("#security-code")
const securityCodePattern = {
  mask: "000",
}
const securityCodeMasked = IMask(securityCode, securityCodePattern)

const expirationDate = <HTMLElement>document.querySelector("#expiration-date")
const expirationDatePattern = {
  mask: "MM{/}YY",
  blocks: {
    MM: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12,
    },
    YY: {
      mask: IMask.MaskedRange,
      from: String(new Date().getFullYear()).slice(2),
      to: String(new Date().getFullYear() + 10).slice(2),
    },
  },
}
const expirationDateMasked = IMask(expirationDate, expirationDatePattern)

const cardNumber = <HTMLElement>document.querySelector("#card-number")
const cardNumberPattern = {
  mask: [
    {
      mask: "0000 0000 0000 0000",
      regex: /^4\d{0,15}/,
      cardtype: "visa",
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
      cardtype: "mastercard",
    },
    {
      mask: "0000 0000 0000 0000",
      cardtype: "default",
    },
  ],
  dispatch: function (appended: unknown, dynamicMasked: any) {
    const number = (dynamicMasked.value + appended).replace(/\D/g, "")
    const foundMask = dynamicMasked.compiledMasks.find(function (mask: any) {
      return number.match(mask.regex)
    })
    return foundMask
  },
}
const cardNumberMasked = IMask(cardNumber, cardNumberPattern)

const form = document.querySelector("form")

document.querySelector("form")!.addEventListener("submit", (e) => {
  e.preventDefault()
  alert("Cartão adicionado!")
  form?.reset()
})

const cardHolder = <HTMLInputElement>document.querySelector("#card-holder")
cardHolder.addEventListener("input", () => {
  const ccHolder = <HTMLInputElement>document.querySelector(".cc-holder .value")
  if (cardHolder!.value.length < 20) {
    ccHolder.innerText =
      cardHolder.value.length > 0 ? cardHolder.value : "FULANO DA SILVA"
  }
})

securityCodeMasked.on("accept", function () {
  updateSecurityCode(securityCodeMasked.value)
})

function updateSecurityCode(code: string) {
  const ccSecurity = <HTMLInputElement>(
    document.querySelector(".cc-security .value")
  )
  ccSecurity.innerText = code.length > 0 ? code : "123"
}

cardNumberMasked.on("accept", function () {
  const type = cardNumberMasked.masked.currentMask
  const cardType = type?.cardtype
  setCardType(cardType)
  updatecardNumber(cardNumberMasked.value)
})

function updatecardNumber(value: string) {
  const ccNumber = <HTMLInputElement>document.querySelector(".cc-number")
  ccNumber.innerText = value.length > 0 ? value : "1234 5678 9012 3456"
}

expirationDateMasked.on("accept", function () {
  updateExpirationDate(expirationDateMasked.value)
})

function updateExpirationDate(date: string) {
  const ccExpiration = <HTMLInputElement>(
    document.querySelector(".cc-extra .value ")
  )
  ccExpiration.innerText = date.length > 0 ? date : "02/32"
}
