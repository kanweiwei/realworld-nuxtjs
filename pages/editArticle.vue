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
                  v-model="article.title"
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  type="text"
                  class="form-control"
                  placeholder="What's this article about?"
                  v-model="article.description"
                />
              </fieldset>
              <fieldset class="form-group">
                <textarea
                  class="form-control"
                  rows="8"
                  placeholder="Write your article (in markdown)"
                  v-model="article.body"
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
                @click.prevent="update"
              >
                Update Article
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
  name: "EditArticle",
  async asyncData({ params }) {
    try {
      const { data } = await Article.getArticle(params.slug);
      return {
        article: data.article,
        tags: data.article.tagList.join(" "),
        errors: [],
      };
    } catch (error) {}
  },
  computed: {
    tagList() {
      return this.tags.split(" ").filter((n) => n.trim().length);
    },
  },
  methods: {
    async update() {
      try {
        await Article.updateArticle(this.$route.params.slug, {
          article: {
            title: this.article.title,
            description: this.article.description,
            body: this.article.body,
            tagList: this.tagList,
          },
        });
        this.errors = [];
        this.$toast.success("update successfully");
        this.$router.go(-1);
      } catch (error) {
        console.log(error)
        this.errors = error.response.data.errors;
        this.$toast.error(error.message);
      }
    },
  },
};
</script>

<style>
</style>