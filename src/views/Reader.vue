z<template>
  <ion-page>
    <ion-content :fullscreen="true">
      { text }

      <div id="ebook-viewer" ref="viewer">
        <div v-for="(line, lineIndex) in text.split('\n')" :key="lineIndex">
          <span
            v-for="(character, characterIndex) in line.split('')"
            :key="characterIndex"
            v-on:click="onCharacterClick(line, characterIndex)"
          >
            {{ character }}
          </span>
        </div>
      </div>
      <div class="button-bar">
        <button
          id="openFile"
          v-on:click="goToBookSelection()"
          style="flex-grow: 1"
        >
          B
        </button>
        <button id="btnPageUp" ref="btnPageUp" style="flex-grow: 1">⇑</button>
        <button id="btnScrollUp" ref="btnScrollUp" style="flex-grow: 4">↑</button>
        <button id="btnScrollDown" ref="btnScrollDown" style="flex-grow: 4">↓</button>
        <button id="btnPageDown" ref="btnPageDown" style="flex-grow: 1">⇓</button>
      </div>
      <div id="completion-indicator" ref="completionIndicator"></div>
      <iframe
        id="integrated-japanese-dictionary-popup"
        src="https://japanese-dictionary-iframe.herokuapp.com"
      >
      </iframe>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { getTextFromFile } from "@/read-text-file";
import {
  BookSettings,
  getPersistedSettings,
  persistBookSettings,
} from "@/settings";
import { IonContent, IonPage } from "@ionic/vue";
import { defineComponent } from "vue";

const LOADING_MESSAGE = "読み込み中・・・"

export default defineComponent({
  name: "Reader",
  components: {
    IonContent,
    IonPage,
  },
  data() {
    return {
      text: LOADING_MESSAGE,
      book: null as BookSettings,
      scrollSpeed: 0,
      scrollFramesToSkip: 3,
      setIntervalHandle: null,
    };
  },
  mounted() {
    const btnPageUp = document.getElementById("btnPageUp");
    const btnScrollUp = document.getElementById("btnScrollUp");
    const btnScrollDown = document.getElementById("btnScrollDown");
    const btnPageDown = document.getElementById("btnPageDown");

    btnPageUp.addEventListener("touchstart", this.pageUp);
    btnPageUp.addEventListener("mousedown", this.pageUp);
    btnPageUp.addEventListener("touchend", this.stopScrolling);
    btnPageUp.addEventListener("mouseup", this.stopScrolling);

    btnScrollUp.addEventListener("touchstart", this.scrollUp);
    btnScrollUp.addEventListener("mousedown", this.scrollUp);
    btnScrollUp.addEventListener("touchend", this.stopScrolling);
    btnScrollUp.addEventListener("mouseup", this.stopScrolling);

    btnScrollDown.addEventListener("touchstart", this.scrollDown);
    btnScrollDown.addEventListener("mousedown", this.scrollDown);
    btnScrollDown.addEventListener("touchend", this.stopScrolling);
    btnScrollDown.addEventListener("mouseup", this.stopScrolling);

    btnPageDown.addEventListener("touchstart", this.pageDown);
    btnPageDown.addEventListener("mousedown", this.pageDown);
    btnPageDown.addEventListener("touchend", this.stopScrolling);
    btnPageDown.addEventListener("mouseup", this.stopScrolling);

    window.addEventListener("keydown", (ev) => {
      if (ev.repeat) return;
      switch (ev.key) {
        case "ArrowDown":
          this.scrollDown(ev);
          break;
        case "ArrowUp":
          this.scrollUp(ev);
          break;
        case "PageDown":
          this.pageDown(ev);
          break;
        case "PageUp":
          this.pageUp(ev);
          break;
      }
    });

    window.addEventListener("keyup", (ev) => {
      this.stopScrolling(ev);
    });

    this.setIntervalHandle = setInterval(() => {
      this.handleScrollMovement()
    }, 50);
  },
  beforeUnmount() {
    clearInterval(this.setIntervalHandle)
  },
  created () {
    // fetch the data when the view is created and the data is
    // already being observed
    this.loadBook()
  },
  watch: {
    // call again the method if the route changes
    '$route': 'loadBook'
  },
  methods: {
    async loadBook() {
      console.log("loadBook");

      const bookIndex = this.$route.params.bookIndex as string
      if (bookIndex === undefined)
      // loadBook() was called by the $route watch when navigating out of the component
        return 

      this.text = LOADING_MESSAGE

      const settings = getPersistedSettings();
      this.book = settings.books[Number.parseInt(bookIndex)];

      console.log("reader mounted");
      if (!this.book) this.goToBookSelection();

      try {
        this.text = await getTextFromFile(this.book.uri);
      } catch (exc) {
        console.error(exc);
        this.text = "an exception occurred";
      }
      console.log("finished reading");
    },
    handleScrollMovement() {
      if (!this.book)
        return

      const viewer = this.$refs.viewer as HTMLDivElement

      // If the app has just been opened but the saved scroll position still hasn't been applied, apply it.
      if (this.book.scrollTop && !viewer.scrollTop) {
        viewer.scrollTo({ top: Number(this.book.scrollTop), left: 0 });
        this.updateCompletionIndictator();
      }

      if (this.scrollSpeed != 0) {
        if (this.scrollFramesToSkip > 0) this.scrollFramesToSkip--;
        else {
          this.performScrolling(this.scrollSpeed);
          this.updateCompletionIndictator();
        }
      }
    },
    performScrolling(amount: number) {
      const viewer = this.$refs.viewer as HTMLDivElement
      viewer.scrollBy({ top: amount, left: 0 });
      this.book.scrollTop = viewer.scrollTop;

      persistBookSettings(this.book);
    },
    pageUp(ev) {
      ev.preventDefault();
      this.performScrolling((this.scrollSpeed = -200));
    },
    scrollUp(ev) {
      ev.preventDefault();
      this.performScrolling((this.scrollSpeed = -20));
    },
    scrollDown(ev) {
      ev.preventDefault();
      this.performScrolling((this.scrollSpeed = 20));
    },
    pageDown(ev) {
      ev.preventDefault();
      this.performScrolling((this.scrollSpeed = 200));
    },
    stopScrolling(ev) {
      ev.preventDefault();
      this.scrollSpeed = 0;
      this.scrollFramesToSkip = 3;
    },
    updateCompletionIndictator() {
      const viewer = this.$refs.viewer as HTMLDivElement
      const completionIndicator = this.$refs.completionIndicator as HTMLDivElement

      if (!viewer.scrollHeight) completionIndicator.innerText = "0%";
      else
        completionIndicator.innerText =
          Math.round((viewer.scrollTop / viewer.scrollHeight) * 1000) / 10 +
          "%";
    },
    onCharacterClick(text: string, index: number) {
      let offset = index;

      if (offset > 50) {
        text = text.substring(offset - 25, offset + 25);
        offset = 25;
      } else {
        text = text.substring(0, 100);
      }

      const popup = document.getElementById(
        "integrated-japanese-dictionary-popup"
      ) as HTMLIFrameElement;
      popup.contentWindow.postMessage(
        { text, offset },
        "https://japanese-dictionary-iframe.herokuapp.com"
      );
    },
    goToBookSelection() {
      this.$router.push({ path: "/books" });
    },
  },
});
</script>

<style scoped>
#ebook-viewer {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
    "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  white-space: pre-wrap;
  overflow-wrap: break-word;
  position: fixed;
  top: 50%;
  left: 0;
  width: calc(100% - 30px);
  height: 50%;
  overflow: hidden;
  z-index: -1;
  font-size: larger;
}

.button-bar {
  display: flex;
  flex-direction: column;
  height: 50%;
  width: 30px;
  position: fixed;
  right: 0;
  top: 50%;
}

.button-bar button {
  border: 0;
  padding: 0;
}

#completion-indicator {
  color: white;
  position: fixed;
  top: 50%;
  right: 30px;
  background-color: black;
}

#integrated-japanese-dictionary-popup {
  box-sizing: border-box;
  position: fixed;
  top: 0;
  left: 0px;
  width: 100%;
  height: 50%;
  border-top: 0;
  border-left: 0;
  border-bottom: solid 2px;
  border-right: 0;
  z-index: 10;
  background-color: black;
}

input {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 50;
}
</style>


