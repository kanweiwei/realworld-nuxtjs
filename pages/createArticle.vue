<template>
  <div class="editor-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-10 offset-md-1 col-xs-12">
          <ul class="error-messages">
            <template v-for="(messages, field) in errors">
              <li v-for="(message, index) in messages" :key="index">
                {{ field }} {{ message }}
              </li>
            </template>
          </ul>
          <form>
            <fieldset>
              <fieldset class="form-group">
                <input
                  type="text"
                  class="form-control form-control-lg"
                  placeholder="Article Title"
                  v-model="title"
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  type="text"
                  class="form-control"
                  placeholder="What's this article about?"
                  v-model="description"
                />
              </fieldset>
              <fieldset class="form-group">
                <textarea
                  class="form-control"
                  rows="8"
                  placeholder="Write your article (in markdown)"
                  v-model="body"
                ></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input
                  type="text"
                  class="form-control"
                  placeholder="Enter tags"
                  v-model="tags"
                />
                <div class="tag-list"></div>
              </fieldset>
              <button
                class="btn btn-lg pull-xs-right btn-primary"
                type="button"
                @click.prevent="publish"
              >
                Publish Article
              </button>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Article from "@/services/articles";

export default {
  name: "CreateArticle",
  data() {
    return {
      errors: [],
      title: "",
      description: "",
      body: "",
      tags: "",
    };
  },
  computed: {
    tagList() {
      return this.tags.split(" ").filter((n) => n.trim().length);
    },
  },
  methods: {
    async publish() {
      try {
        await Article.create({
          article: {
            title: this.title,
            description: this.description,
            body: this.body,
            tagList: this.tagList,
          },
        });
        this.reset();
        this.$toast.success("publish successfully");
      } catch (error) {
         this.errors = error.response.data.errors;
        this.$toast.error(error.message);
      }
    },
    reset() {
      this.errors = [];
      this.title = "";
      this.description = "";
      this.body = "";
      this.tags = "";
    },
  },
};
</script>

<style>
</style>