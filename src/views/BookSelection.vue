
<template>
  <ion-page>
    <ion-content :fullscreen="true">
      {{ JSON.stringify(settings) }}
      <div class="page">
        <ul class="book-list">
          <li
            v-for="book in settings?.books"
            v-bind:key="book.uri"
            v-on:click="bookSelected(book)"
          >
            {{ book }}
          </li>
        </ul>
        <button v-on:click="openFile()">Open</button>
      </div>
    </ion-content>
  </ion-page>
</template>



<script lang="ts">
import { IonContent, IonPage } from "@ionic/vue";
import { defineComponent } from "vue";
import { FileChooser } from "@ionic-native/file-chooser";
import { BookSettings, Settings } from "../settings";

export default defineComponent({
  name: "BookSelection",
  components: {
    IonContent,
    IonPage,
  },
  data() {
    let settings = JSON.parse(
      window.localStorage.getItem("settings")
    ) as Settings;

    if (!settings) settings = { books: [] };

    return {
      settings,
    };
  },
  methods: {
    async openFile() {
      const uri = await FileChooser.open();


      (window as any).resolveLocalFileSystemURL(uri, (res) => {
        const fileName = res.name;
        console.log("uri", uri);
        console.log("fileName", fileName);

        const existingBook = this.settings.books.find((b) => b.uri == uri);
        if (!existingBook) {
          this.settings.books.push({
            uri: uri,
            fileName,
            scrollTop: 0,
          });
          localStorage.setItem("settings", JSON.stringify(this.settings));
        }
      });
    },
    bookSelected(book: BookSettings) {
      console.log(book);

      window["selectedBook"] = book;

      console.log(this.$router.currentRoute.value);
      this.$router.push({ path: "/reader" });
    },
  },
});
</script>

<style scoped>
.book-list {
  padding: 0px;
}
.book-list li {
  padding: 5px;
  background-color: green;
  list-style: none;
}
</style>
