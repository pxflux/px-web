<template>
	<header>
		<div class="wrap">
			<router-link to="/" >
				<div id="px-logo-box" class="px-logo flick">
					<canvas id="px-logo"></canvas>
					<span class="label beta">beta</span>
				</div>
			</router-link>
			<div class="sub-links button flick">
				<a v-if="user" @click="logOut" class="login-btn">Logout</a>
				<router-link v-if=" ! user" to="/auth" class="login-btn">Login</router-link>
			</div>
			<router-link to="/" >
				<div class="button flick">
					<span class="label beta">?</span>
				</div>
			</router-link>
		</div>
	</header>
</template>

<script>
  import firebaseApp from '../firebase'

  export default {
    created () {
      this.user = firebaseApp.auth().currentUser
    },
    data () {
      return {
        user: {}
      }
    },
    methods: {
      logOut () {
        firebaseApp.auth().signOut()
      }
    }
  }
</script>
