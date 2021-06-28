<template>
  <div class="profile-page">
    <div class="user-info">
      <div class="container">
        <div class="row">
          <div class="col-xs-12 col-md-10 offset-md-1">
            <img :src="profile.image" v-if="profile.image" class="user-img" />
            <h4>{{ profile.username }}</h4>
            <p>
              {{ profile.bio }}
            </p>
            <nuxt-link
              ui-sref="app.settings"
              class="btn btn-sm btn-outline-secondary action-btn"
              v-if="profile.username === $store.state.user.username"
              to="/settings"
            >
              <i class="ion-gear-a"></i> Edit Profile Settings
            </nuxt-link>
            <button
              v-else
              class="btn btn-sm btn-outline-secondary action-btn"
              @click.prevent="onFollow"
            >
              <i class="ion-plus-round"></i>
              &nbsp; {{ profile.following ? "UnFollow" : "Follow" }}
              {{ $route.params.username }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="row">
        <div class="col-xs-12 col-md-10 offset-md-1">
          <div class="articles-toggle">
            <ul class="nav nav-pills outline-active">
              <li class="nav-item">
                <nuxt-link
                  class="nav-link"
                  :class="{ active: tab === 'my_articles' }"
                  :to="{
                    name: 'profile',
                    params: { username: $route.params.username },
                    query: {
                      tab: 'my_articles',
                    },
                  }"
                  exact
                  >My Articles</nuxt-link
                >
              </li>
              <li class="nav-item">
                <nuxt-link
                  class="nav-link"
                  :class="{ active: tab === 'favorited_articles' }"
                  :to="{
                    name: 'profile',
                    params: { username: $route.params.username },
                    query: {
                      tab: 'favorited_articles',
                    },
                  }"
                  exact
                  >Favorited Articles</nuxt-link
                >
              </li>
            </ul>
          </div>

          <span v-if="!loading && articles.length == 0">
            <p>No articles are here... yet.</p>
          </span>
          <template v-else
            ><div
              class="article-preview"
              v-for="article in articles"
              :key="article.slug"
            >
              <div class="article-meta">
                <nuxt-link
                  :to="{
                    name: 'profile',
                    params: {
                      username: article.author.username,
                    },
                  }"
                >
                  <!-- <img :src="article.author.image" v-if="article.author.image"
              /> -->
                </nuxt-link>
                <div class="info">
                  <a href="" class="author">{{ article.author.username }}</a>
                  <span class="date">{{
                    article.createdAt | date("MMM/DD YYYY")
                  }}</span>
                </div>
                <button
                  class="btn btn-outline-primary btn-sm pull-xs-right"
                  :class="{ active: article.favorited }"
                  @click.stop.prevent="onFavorite(article)"
                >
                  <i class="ion-heart"></i> {{ article.favoritesCount }}
                </button>
              </div>
              <nuxt-link
                :to="{
                  name: 'article',
                  params: {
                    slug: article.slug,
                  },
                }"
                class="preview-link"
              >
                <h1>{{ article.title }}</h1>
                <p>{{ article.description }}</p>
                <span>Read more...</span>
              </nuxt-link>
            </div>
            <!-- 分页列表 -->
            <nav>
              <ul class="pagination">
                <li
                  class="page-item"
                  v-for="pageNumber in pageRange(articlesCount)"
                  :key="pageNumber"
                  :class="{
                    active: pageNumber === page,
                  }"
                >
                  <nuxt-link
                    class="page-link"
                    :to="{
                      name: 'home',
                      query: {
                        page: pageNumber,
                        tag: $route.query.tag,
                        tab: tab,
                      },
                    }"
                    >{{ pageNumber }}</nuxt-link
                  >
                </li>
              </ul>
            </nav>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ProfileApi from "@/services/profile.js";
import Article from "@/services/articles";

export default {
  name: "Profile",
  async asyncData({ params, query }) {
    const page = query.page || 1;
    const limit = 20;
    const tab = query.tab || "my_articles";
    const isAuthor = tab === "my_articles";
    const { data } = await ProfileApi.getProfile(params.username);
    console.log(data);
    const { data: articleData } = await Article.getAllAsync({
      author: isAuthor ? params.username : undefined,
      favorited: tab === "favorited_articles" ? params.username : undefined,
      limit,
      offset: (page - 1) * limit,
    });
    return {
      profile: data.profile,
      articles: articleData.articles,
      articlesCount: articleData.articlesCount,
      page,
      limit,
      tab,
      loading: false,
    };
  },
  watchQuery: ["tab", "page"],
  methods: {
    async onFollow() {
      if (this.profile.username === this.$store.state.user.username) return;
      try {
        if (this.profile.following) {
          await ProfileApi.unFollow(this.profile.username);
          this.profile.following = false;
        } else {
          await ProfileApi.follow(this.profile.username);
          this.profile.following = true;
        }
      } catch (error) {
        this.$toast.error(error.message);
      }
    },
    pageRange(num) {
      return Math.max(Math.ceil(num / 20), 1);
    },
  },
};
</script>

<style>
</style>