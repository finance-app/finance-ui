import { NativeScriptConfig } from '@nativescript/core'

export default {
  id: 'org.nativescript.financeui',
  appPath: 'src',
  appResourcesPath: 'App_Resources',
  android: {
    v8Flags: '--expose_gc',
    markingMode: 'none',
  },
  nsext: '.tns',
  webext: '',
  shared: true,
} as NativeScriptConfig
