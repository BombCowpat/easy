<template>
  <div :class="classObj" class="app-wrapper" :style="{ '--current-color': theme }">
    <div v-if="device === 'mobile' && sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
    <Sidebar v-if="!sidebar.hide" class="sidebar-container" />
    <div :class="{ hasTagsView: needTagsView, sidebarHide: sidebar.hide }" class="main-container">
      <div :class="{ 'fixed-header': fixedHeader }">
        <navbar @setLayout="setLayout" />
        <tags-view v-if="needTagsView" />
      </div>
      <app-main />
      <settings ref="settingRef" />
    </div>
  </div>
</template>

<script>
import { ref, computed, watchEffect } from 'vue'
import { useWindowSize } from '@vueuse/core'
import Sidebar from './components/Sidebar/index.vue'
import Navbar from './components/Navbar.vue'
import AppMain from './components/AppMain.vue'
import TagsView from './components/TagsView/index.vue'
import Settings from './components/Settings/index.vue'
import { useSettingsStore } from '@/stores/settings'
import { useAppStore } from '@/stores/app'

export default {
  components: {
    Sidebar,
    AppMain,
    Navbar,
    TagsView,
    Settings,
  },
  setup() {
    const settingsStore = useSettingsStore()
    const settingRef = ref(null)
    const theme = computed(() => settingsStore.theme)
    const sidebar = computed(() => useAppStore().sidebar)
    const device = computed(() => useAppStore().device)
    const fixedHeader = computed(() => settingsStore.fixedHeader)
    const { width } = useWindowSize()
    const WIDTH = 992
    const classObj = computed(() => ({
      hideSidebar: !sidebar.value.opened,
      openSidebar: sidebar.value.opened,
      withoutAnimation: sidebar.value.withoutAnimation,
      mobile: device.value === 'mobile',
    }))
    const needTagsView = computed(() => settingsStore.tagsView)
    function setLayout() {
      settingRef.value.openSetting()
    }
    watchEffect(() => {
      if (device.value === 'mobile' && sidebar.value.opened) {
        useAppStore().closeSideBar({ withoutAnimation: false })
      }
      if (width.value - 1 < WIDTH) {
        useAppStore().toggleDevice('mobile')
        useAppStore().closeSideBar({ withoutAnimation: true })
      } else {
        useAppStore().toggleDevice('desktop')
      }
    })
    function handleClickOutside() {
      useAppStore().closeSideBar({ withoutAnimation: false })
    }
    return {
      theme,
      device,
      sidebar,
      classObj,
      setLayout,
      settingRef,
      fixedHeader,
      needTagsView,
      handleClickOutside,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/mixin.scss';
@import '@/assets/styles/variables.module.scss';
.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;

  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}

.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - #{$base-sidebar-width});
  transition: width 0.28s;
}

.hideSidebar .fixed-header {
  width: calc(100% - 54px);
}

.sidebarHide .fixed-header {
  width: 100%;
}

.mobile .fixed-header {
  width: 100%;
}
</style>
