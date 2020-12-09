<template>
  <div>
    <nav-bar />
    <v-main>
      <div class="mx-16 my-16">
        <v-data-table
          :headers="tHeaders"
          :items="requests"
          :items-per-page="5"
          class="elevation-2"
        >
          <template v-slot:item="{ item }">
            <td>
              {{ item.name }}
            </td>
            <td>
              {{ item.email }}
            </td>
            <td>{{ item.class }}</td>
            <td>{{ item.addedOn | formatDate }}</td>
            <td>
              <button
                :value="item._id"
                @click="remove"
                class="link rounded-pill red px-5 mx-auto text-subtitle-1"
              >
                Remove
              </button>
            </td>
          </template>
        </v-data-table>
      </div>
    </v-main>
  </div>
</template>

<script>
import navBar from "@/components/admin/navBar.vue";
import Axios from "axios";
import { API_URL } from "@/store/consts";

export default {
  name: "Requests",
  components: {
    navBar
  },
  data() {
    return {
      loading: true,
      tHeaders: [
        {
          text: "Name",
          align: "start",
          value: "name"
        },
        { text: "Email", value: "email" },
        { text: "Class", value: "class" },
        { text: "Requested on", value: "addedOn" },
        { text: "Actions", value: "actions", align: "center" }
      ],
      requests: []
    };
  },
  mounted() {
    this.$nextTick(function() {
      Axios.get(API_URL + "/student/all", {
        headers: { authorization: window.localStorage.getItem("adminToken") }
      })
        .then(res => {
          console.log(res.data);
          this.loading = false;
          this.requests = res.data.filter(v => !v.confirmed);
        })
        .catch(() => {
          this.loading = false;
        });
    });
  },
  methods: {
    confirm(e) {
      console.log(e.target.value);
      Axios.post(
        API_URL + "/student/confirm",
        { _id: e.target.value },
        {
          headers: { authorization: window.localStorage.getItem("adminToken") }
        }
      )
        .then(res => {
          if (res.data.type === "success") {
            this.requests = this.requests.filter(v => v._id != e.target.value);
            this.$toasted.show(res.data.msg, { type: "success" }).goAway(3000);
          } else {
            this.$toasted.show(res.data.msg, { type: "error" }).goAway(3000);
          }
        })
        .catch(() => {
          this.$toasted
            .show("Internal Server Error", { type: "error" })
            .goAway(3000);
        });
    },
    reject(e) {
      console.log(e.target.value);
      Axios.delete(API_URL + "/student/" + e.target.value, {
        headers: { authorization: window.localStorage.getItem("adminToken") }
      })
        .then(res => {
          if (res.data.type === "success") {
            this.requests = this.requests.filter(v => v._id != e.target.value);
            this.$toasted.show(res.data.msg, { type: "success" }).goAway(3000);
          } else {
            this.$toasted.show(res.data.msg, { type: "error" }).goAway(3000);
          }
        })
        .catch(() => {
          this.$toasted
            .show("Internal Server Error", { type: "error" })
            .goAway(3000);
        });
    }
  },
  filters: {
    formatDate(d) {
      if (!d) return "";
      d = new Date(Number(d));
      console.log(d);
      return (
        d.toLocaleDateString() +
        " - " +
        d.toLocaleTimeString().substr(0, 4) +
        d.toLocaleTimeString().substr(7)
      );
    }
  }
};
</script>

<style></style>
