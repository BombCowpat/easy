<template>
  <div>
    <el-card class="mt40 mxauto w-1/4">
      <h3 class="text-center text-xl mb2">后台管理系统</h3>
      <el-form ref="form" :model="loginForm" :rules="rules" status-icon>
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" placeholder="admin">
            <template #prefix>
              <IEpUser />
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" placeholder="admin123" type="password">
            <template #prefix>
              <IEpLock />
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="code" v-if="captchaEnabled">
          <div class="flex">
            <el-input v-model="loginForm.code" auto-complete="off" placeholder="验证码" class="w-2/3 mr-2"></el-input>
            <div class="w-1/3">
              <img :src="codeUrl" @click="getCode" />
            </div>
          </div>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="loginForm.rememberMe" label="记住密码" size="large" />
        </el-form-item>
        <el-form-item>
          <el-button @click="handleLogin" type="primary" style="width: 100%" :loading="loading">
            <span v-if="!loading">登 录</span>
            <span v-else>登 录 中...</span>
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import { reactive, ref, onMounted } from 'vue'
import { getCodeImg } from '@/api/login'
import { encrypt, decrypt } from '@/utils/jsencrypt.js'
import { useUserStore } from '@/stores/user'
import { useRouter, useRoute } from 'vue-router'
export default {
  setup() {
    const form = ref(null)
    const captchaEnabled = ref(false)
    const codeUrl = ref('')
    const loading = ref(false)
    const redirect = ref(undefined)
    const router = useRouter()
    const route = useRoute()
    const loginForm = reactive({
      username: '',
      password: '',
      rememberMe: false,
      code: '',
      uuid: '',
    })
    const rules = reactive({
      username: [{ required: true, trigger: 'blur', message: '请输入您的账号' }],
      password: [{ required: true, trigger: 'blur', message: '请输入您的密码' }],
      code: [{ required: true, trigger: 'change', message: '请输入验证码' }],
    })
    const user = useUserStore()
    function getCode() {
      getCodeImg().then(res => {
        captchaEnabled.value = res.captchaEnabled
        codeUrl.value = 'data:image/gif;base64,' + res.img
        loginForm.uuid = res.uuid
      })
    }
    function getCookie() {
      loginForm.username = Cookies.get('username')
      const password = decrypt(Cookies.get('password'))
      if (password) {
        loginForm.password = password
      }
      loginForm.rememberMe = Cookies.get('rememberMe') === 'true' ? true : false
    }
    function handleLogin() {
      form.value.validate(valid => {
        if (valid) {
          loading.value = true
          if (loginForm.rememberMe) {
            Cookies.set('username', loginForm.username, { expires: 30 })
            Cookies.set('password', encrypt(loginForm.password), { expires: 30 })
            Cookies.set('rememberMe', loginForm.rememberMe, { expires: 30 })
          } else {
            Cookies.remove('username')
            Cookies.remove('password')
            Cookies.remove('rememberMe')
          }
          user
            .login(loginForm)
            .then(() => {
              loading.value = false
              return router.push(redirect.value || '/')
            })
            .catch(() => {
              loading.value = false
            })
        }
      })
    }
    getCode()
    getCookie()
    onMounted(() => {
      redirect.value = route.query.redirect
    })
    return {
      form,
      captchaEnabled,
      codeUrl,
      loginForm,
      loading,
      rules,
      getCode,
      handleLogin,
    }
  },
}
</script>

<style lang="scss" scoped></style>
