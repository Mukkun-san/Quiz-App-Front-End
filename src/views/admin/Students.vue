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
          <template v-slot:item.actions="{ item }">
            <button>
              <v-chip class="red lighten-2 white--text">
                <v-btn text :value="item._id" @click="remove">
                  Delete
                </v-btn>
              </v-chip>
            </button>
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
Axios.defaults.headers.common["Access-Control-Allow-Origin"] = "*";

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
        { text: "Added on", value: "addedOn" },
        { text: "Actions", value: "actions" }
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
          this.requests = res.data.filter(v => v.confirmed);
        })
        .catch(() => {
          this.loading = false;
        });
    });
  },
  methods: {
    remove(e) {
      console.log(e.target, e.target.value);
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
  }
};
</script>

<style></style>
