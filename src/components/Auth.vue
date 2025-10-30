<template>
  <div class="auth-container">
    <div v-if="authError" class="auth-error">
      <p>Authentication failed: {{ authError }}</p>
      <button @click="clearError" class="error-dismiss">×</button>
    </div>

    <div v-if="!user" class="auth-form">
      <h2>Sign In</h2>

      <!-- Google Sign-In Button -->
      <button @click="signInWithGoogle" class="auth-button google-button" :disabled="isLoading">
        <span v-if="isLoading && currentProvider === 'google'">Signing in...</span>
        <span v-else>Sign in with Google</span>
      </button>

      <div class="divider">
        <span>OR</span>
      </div>

      <!-- Email/Password Form -->
      <form @submit.prevent="signInWithEmail" class="email-form">
        <div class="form-group">
          <label for="email">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="Enter your email"
            required
            :disabled="isLoading"
          >
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="Enter your password"
            required
            :disabled="isLoading"
          >
        </div>

        <button type="submit" class="auth-button email-button" :disabled="isLoading || !email || !password">
          <span v-if="isLoading && currentProvider === 'email'">Signing in...</span>
          <span v-else>Sign In with Email</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  AuthError
} from 'firebase/auth'
import { auth } from '../firebase-app'

const store = useStore()
const route = useRoute()
const router = useRouter()

// Form state
const email = ref('')
const password = ref('')
const authError = ref(null)
const isLoading = ref(false)
const currentProvider = ref(null)

// Computed properties
const user = computed(() => store.state.user)

// Methods
const clearError = () => {
  authError.value = null
}

const getErrorMessage = (error) => {
  if (error.code) {
    switch (error.code) {
      case 'auth/user-not-found':
        return 'No account found with this email address'
      case 'auth/wrong-password':
        return 'Incorrect password'
      case 'auth/invalid-email':
        return 'Invalid email address'
      case 'auth/user-disabled':
        return 'This account has been disabled'
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later'
      case 'auth/network-request-failed':
        return 'Network error. Please check your connection'
      case 'auth/email-already-in-use':
        return 'An account with this email already exists'
      case 'auth/weak-password':
        return 'Password is too weak'
      case 'auth/operation-not-allowed':
        return 'Email/password accounts are not enabled'
      case 'auth/popup-closed-by-user':
        return 'Sign-in was cancelled'
      case 'auth/popup-blocked':
        return 'Sign-in popup was blocked by the browser'
      default:
        return `Authentication error: ${error.message || error.code}`
    }
  } else {
    return error.message || 'Unknown authentication error'
  }
}

const signInWithGoogle = async () => {
  try {
    clearError()
    isLoading.value = true
    currentProvider.value = 'google'

    const provider = new GoogleAuthProvider()
    provider.addScope('https://www.googleapis.com/auth/plus.login')

    const result = await signInWithPopup(auth, provider)
    console.log('Sign-in successful:', result.user.email)
    clearError()
  } catch (error) {
    console.error('Google sign-in failed:', error)
    authError.value = getErrorMessage(error)
  } finally {
    isLoading.value = false
    currentProvider.value = null
  }
}

const signInWithEmail = async () => {
  try {
    clearError()
    isLoading.value = true
    currentProvider.value = 'email'

    const result = await signInWithEmailAndPassword(auth, email.value, password.value)
    console.log('Sign-in successful:', result.user.email)
    clearError()

    // Clear form after successful sign-in
    email.value = ''
    password.value = ''
  } catch (error) {
    console.error('Email sign-in failed:', error)
    authError.value = getErrorMessage(error)
  } finally {
    isLoading.value = false
    currentProvider.value = null
  }
}

// Watch for user changes and handle redirects
watch(user, (val) => {
  if (val) {
    if (route.query.redirect) {
      router.replace(route.query.redirect)
    } else {
      router.replace('/')
    }
  }
})
</script>

<style lang="sass">
.auth-container
  max-width: 768px
  margin: 0 auto
  padding: 20px

.auth-error
  background-color: #fee
  border: 1px solid #fcc
  border-radius: 4px
  padding: 12px 16px
  margin-bottom: 16px
  position: relative
  color: #c33
  font-size: 14px

  p
    margin: 0
    padding-right: 20px

  .error-dismiss
    position: absolute
    top: 8px
    right: 8px
    background: none
    border: none
    font-size: 18px
    cursor: pointer
    color: #c33
    padding: 0
    width: 20px
    height: 20px
    display: flex
    align-items: center
    justify-content: center

    &:hover
      background-color: #fdd
      border-radius: 2px

.auth-form
  background: white
  border-radius: 8px
  padding: 24px
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1)

  h2
    text-align: center
    margin-bottom: 24px
    color: #363636
    font-weight: 300
    font-size: 24px

.auth-button
  width: 100%
  padding: 12px 16px
  border: none
  border-radius: 4px
  font-size: 16px
  font-weight: 500
  cursor: pointer
  transition: all 0.2s ease
  margin-bottom: 16px

  &:disabled
    opacity: 0.6
    cursor: not-allowed

.google-button
  background-color: #4285f4
  color: white

  &:hover:not(:disabled)
    background-color: #357ae8

.email-button
  background-color: #363636
  color: white

  &:hover:not(:disabled)
    background-color: #292929

.divider
  text-align: center
  margin: 20px 0
  position: relative

  &::before
    content: ''
    position: absolute
    top: 50%
    left: 0
    right: 0
    height: 1px
    background-color: #ddd

  span
    background: white
    padding: 0 16px
    color: #666
    font-size: 14px
    position: relative
    z-index: 1

.email-form
  .form-group
    margin-bottom: 16px

    label
      display: block
      margin-bottom: 4px
      font-weight: 500
      color: #363636

    input
      width: 100%
      padding: 12px
      border: 1px solid #ddd
      border-radius: 4px
      font-size: 16px
      transition: border-color 0.2s ease

      &:focus
        outline: none
        border-color: #4285f4

      &:disabled
        background-color: #f5f5f5
        cursor: not-allowed
</style>
