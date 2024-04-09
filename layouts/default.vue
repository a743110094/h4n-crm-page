<template>
  <i18n-n :value="1234" :format="{ key: 'currency', currency: 'EUR' }">
    <template v-slot:currency="slotProps">
      <span styles="color: green">{{ slotProps.currency }}</span>
    </template>
  </i18n-n>

  <VLayout fit-window fixed-main :expanded="false" logo="https://www.vexipui.com/vexip-ui.svg"
    :sign-name="$t('back.common.title')" :user="user" :menus="menus" :style="{
      '--vxp-layout-aside-width': `210px`,
    }" :on-menu-select="omMenuSelect" @user-action="handleUserAction">
    <template #header-right>
      <!-- <VLinker to="https://github.com/vexip-ui/vexip-ui" style="display: flex; margin-inline-end: 16px">
        <VIcon :scale="1.6">
          <GithubB />
        </VIcon>
      </VLinker> -->
      <VDropdown>
        <VIcon :scale="2.4" class="mr-10">
          <Language />
        </VIcon>
        <template #drop>
          <VDropdownList>
            <VDropdownItem v-for="item in locales" @click="changeLanguage(item.code)">
              {{ item.name }}
            </VDropdownItem>
          </VDropdownList>
        </template>
      </VDropdown>
    </template>
    <template #main>
      <div style="width: 100%;height: 100%; padding: 0 20px;" v-cloak>
        <slot />
      </div>
    </template>
  </VLayout>
</template>

<script setup lang="ts">
import { City, EnvelopesBulk, FirstOrderB, Gift, User, Warehouse, AlignLeft, Language } from '@vexip-ui/icons'
//import 'vexip-ui/css/index.css'
//import 'vexip-ui/css/dark/index.css'
import { BaggageClaim, PlaneTakeoff } from "lucide-vue-next";
import { type MenuOptions } from "vexip-ui"; // 不需要暗黑主题时无需引入
/////////////国际化
const { locale, localeCodes,defaultLocale, locales, setLocale, setLocaleCookie, getLocaleCookie } = useI18n();
const changeLanguage = (lang) => {
  setLocale(lang)
  setLocaleCookie(lang)
}
const urlLocale = locale.value === defaultLocale ? '' :  "/" + locale.value;
/////////////国际化




const user = {
  name: 'VexipUI',
  email: 'email@vexip-ui.com'
}

const i18n = useI18n();
const menus: MenuOptions[] = [
  {
    label: '1',
    name: i18n.t('back.menu.bussiness.root'),
    icon: EnvelopesBulk,
    children: [
      {
        label: '1-1', name: i18n.t('back.menu.bussiness.pick'), icon: BaggageClaim, route: {
          path: urlLocale + '/back/action/goods/pick'
        }
      },
      {
        label: '1-2', name: i18n.t('back.menu.bussiness.place'), icon: BaggageClaim, route: {
          path: urlLocale + '/back/action/order/place'
        }
      },
      {
        label: '1-3', name: i18n.t('back.menu.bussiness.deliver'), icon: PlaneTakeoff, route: {
          path: urlLocale + '/back/action/order/delivery'
        }
      }
    ]
  },
  {
    label: '2',
    name: i18n.t('back.menu.maintain.root'),
    icon: City,
    children: [
      {
        label: '2-1', name: i18n.t('back.menu.maintain.category'), icon: AlignLeft, route: {
          path: urlLocale + '/back/category'
        },
      },
      {
        label: '2-2', name: i18n.t('back.menu.maintain.goods'), icon: Gift, route: {
          path: urlLocale + '/back/goods'
        }
      },
      {
        label: '2-3', name: i18n.t('back.menu.maintain.stock'), icon: Warehouse, route: {
          path: urlLocale + '/back/stock'
        }
      },
      {
        label: '2-4', name: i18n.t('back.menu.maintain.order'), icon: FirstOrderB, route: {
          path: urlLocale + '/back/order'
        }
      },
      {
        label: '2-5', name: i18n.t('back.menu.maintain.customer'), icon: User, route: {
          path: urlLocale + '/back/customer'
        }
      },
    ]
  }
]

function handleUserAction(label: string) {
  console.info(label)
}

// ---- 处理菜单
const omMenuSelect = (label: string) => {
  let m: MenuOptions = findItemByLabel(menus, label);
  if (null === m) {
    Message.error('没有对应的路由')
  }
  useRouter().push(m.route)
}

function findItemByLabel(data, targetLabel) {
  // 遍历当前数组
  for (let item of data) {
    // 如果找到匹配的标签，则返回当前项目
    if (item.label === targetLabel) {
      return item;
    }
    // 否则，如果当前项目有子项目，则递归搜索子项目
    if (item.children) {
      const found: boolean = findItemByLabel(item.children, targetLabel);
      if (found) {
        return found;
      }
    }
  }
  // 如果在所有项目中都没有找到，则返回null
  return null;
}
</script>

<style scoped>
.vxp-layout {
  height: 500px;
}
</style>