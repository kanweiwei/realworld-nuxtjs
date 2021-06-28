<template>
  <div class="settings-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">Your Settings</h1>

          <form @submit.prevent="update">
            <fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control"
                  type="text"
                  placeholder="URL of profile picture"
                  v-model="image"
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control form-control-lg"
                  type="text"
                  placeholder="Your Name"
                  v-model="username"
                  readonly
                />
              </fieldset>
              <fieldset class="form-group">
                <textarea
                  class="form-control form-control-lg"
                  rows="8"
                  placeholder="Short bio about you"
                  v-model="bio"
                ></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control form-control-lg"
                  type="text"
                  placeholder="Email"
                  v-model="email"
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control form-control-lg"
                  type="password"
                  placeholder="Password"
                />
              </fieldset>
              <button class="btn btn-lg btn-primary pull-xs-right">
                Update Settings
              </button>
            </fieldset>
          </form>
          <hr />
          <button class="btn btn-outline-danger" @click="logout">
            Or click here to logout.
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import UserApi from "@/services/user.js";

const Cookie = process.client ? require("js-cookie") : undefined;

export default {
  name: "Settings",
  middleware: ["authorized"],
  async asyncData({ store }) {
    const { user } = store.state;
    return {
      image: user.image,
      bio: user.bio,
      username: user.username,
      email: user.email,
    };
  },
  methods: {
    async update() {
      try {
        await UserApi.updateUser({
          user: {
            email: this.email,
            bio: this.bio,
            image: this.image,
          },
        });
        this.$toast.success("update successfully");
        this.$store.commit("update_user", {
          email: this.email,
          bio: this.bio,
          image: this.image,
        });
      } catch (error) {
        this.$toast.error(error.message);
      }
    },
    logout() {
      Cookie.remove("user");
      this.$store.commit("update_user", null);
      this.$router.replace("/");
    },
  },
};
</script>

<style>
</style>