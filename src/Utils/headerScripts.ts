function loadScript(scriptUrl: string) {
  const googleScriptTag = document.createElement('script')
  googleScriptTag.src = `${scriptUrl}`
  googleScriptTag.async = true
  googleScriptTag.type = 'text/javascript'

  document.getElementsByTagName('head')[0].appendChild(googleScriptTag)
}

export function ensureScripts() {
  if (typeof window !== 'undefined') {
    window.googletag = window.googletag || {}
    window.googletag.cmd = window.googletag.cmd || []
    window.Yieldbird = window.Yieldbird || {}
    window.Yieldbird.cmd = window.Yieldbird.cmd || []
  }
}

export function initializeAdStack(uuid: string, enableSingleRequest = false) {
  if (typeof window !== 'undefined') {
    ensureScripts()
    window.yb_configuration = { lazyLoad: true }

    window.googletag.cmd.push(function () {
      window.googletag.pubads().disableInitialLoad()
    })

    if (enableSingleRequest) {
      window.googletag.cmd.push(function () {
        window.googletag.pubads().enableSingleRequest()
      })
    }

    if (Object.keys(window.googletag).length <= 1) {
      loadScript(
        `${document.location.protocol}//securepubads.g.doubleclick.net/tag/js/gpt.js`
      )
    }

    if (Object.keys(window.Yieldbird).length <= 1) {
      loadScript(
        `${document.location.protocol}//jscdn.yieldbird.com/${uuid}/yb.js`
      )
    }
  }
}
