<template>
  <v-app id="inspire">
    <v-navigation-drawer
      :clipped="$vuetify.breakpoint.lgAndUp"
      v-model="drawer"
      fixed
      app
    >
    <sl-vue-tree v-model="items" @select="nodeSelected" @nodeclick="showInfo">
      <template slot="title" slot-scope="{ node }">
        <span class="item-icon">
          <i class="fa fa-file" v-if="node.isLeaf"></i>
          <i class="fa fa-folder" v-if="!node.isLeaf"></i>
        </span>
        {{ node.title }}
      </template>
    </sl-vue-tree>

    </v-navigation-drawer>
    <v-toolbar
      :clipped-left="$vuetify.breakpoint.lgAndUp"
      color="#203540"
      dark
      app
      fixed
    >
      <v-toolbar-title style="width: 300px" class="ml-0 pl-3">
        <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
        <span class="hidden-sm-and-down">File Explorer</span>
      </v-toolbar-title>
      <!-- <v-text-field
        flat
        solo-inverted
        hide-details
        prepend-inner-icon="search"
        label="Search"
        class="hidden-sm-and-down"
      ></v-text-field> -->
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-content>
      <v-container fluid fill-height>
        <v-layout justify-center align-center>
          <v-breadcrumbs divider=">">
            <v-breadcrumbs-item
              v-for="path in relativePath"
              :key="path.title"
            > {{path.title}}
            </v-breadcrumbs-item>
          </v-breadcrumbs>
          <v-data-table
            :headers="headers"
            :items="fileInfo"
            hide-actions
            class="elevation-1"
          >
            <template slot="items" slot-scope="props">
              <td>{{ props.item.title}}</td>
            </template>
          </v-data-table>
          <!-- for recent activity -->
          <!-- {{lastEvent}} -->
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import axios from 'axios'
import slTree from 'sl-vue-tree/dist/sl-vue-tree.js'
import 'sl-vue-tree/dist/sl-vue-tree-dark.css'

export default {
  data: () => ({
    dialog: false,
    drawer: null,
    lastEvent: '',
    jsonResult: [],
    relativePath: [],
    fileInfo: [],
    prevLevel: -1,
    prevPath: '',
    proxyUrl: 'https://cors-anywhere.herokuapp.com/',
    url: {
      longUrl: 'https://s3-ap-southeast-1.amazonaws.com/he-public-data/long_game_tree77fa4dd.json',
      shortUrl: 'https://s3-ap-southeast-1.amazonaws.com/he-public-data/short_game_treea798b2e.json'
    },
    items: [],
    nodes: [
      {title: 'Item1', isLeaf: true},
      {title: 'Item2', isLeaf: true, data: { visible: false }},
      {title: 'Folder1'},
      {
        title: 'Folder2',
        isExpanded: false,
        children: [
          {title: 'Item3', isLeaf: true},
          {title: 'Item4', isLeaf: true}
        ]
      }
    ],
    headers: [{
      text: 'File Name'
    }]
  }),
  props: {
    source: String
  },
  watch: {
    items: function () {
      // localStorage.removeItem('shortJson')
      // localStorage.setItem('shortJson', JSON.stringify(this.items))
    }
  },
  components: {
    'sl-vue-tree': slTree
  },
  methods: {
    showMenu () {
      if (this.items) {
        this.items.map((item) => {
          item.isExpanded = false
          item.children = []
          if (item.hasOwnProperty('Game play resources')) {
            item.children.push({title: 'Game play resources', isExpanded: false, resources: item['Game play resources']})
            item.children.map((sub) => {
              sub['children'] = []
              if (Object.keys(sub.resources).length > 0) {
                for (let key in sub.resources) {
                  sub['children'].push({title: key, isExpanded: false, children: sub.resources[key]})
                }
                if (sub['children'].length > 0) {
                  sub.children.map((comp) => {
                    if (comp.children.length > 0) {
                      comp.children.map((single) => {
                        single['title'] = single['file_name']
                        single['isLeaf'] = true
                      })
                    }
                  })
                }
              }
            })
          }
        })
      }
    },
    setLocalStorage (jsonInfo) {
      if (jsonInfo[1]) {
        let longObject = jsonInfo[0].length > jsonInfo[1].length ? jsonInfo[0] : jsonInfo[1]
        let shortObject = jsonInfo[0].length < jsonInfo[1].length ? jsonInfo[0] : jsonInfo[1]
        localStorage.setItem('longJson', JSON.stringify(longObject))
        localStorage.setItem('shortJson', JSON.stringify(shortObject))
        this.items = JSON.parse(localStorage.getItem('shortJson'))
        this.showMenu()
      }
    },
    nodeSelected (nodes, event) {
      let newPath = `${nodes.map(node => node.title)}`
      let newLevel = `${nodes.map(node => node.level)}`
      if (this.prevLevel >= newLevel) {
        while (this.relativePath.length !== newLevel - 1) {
          this.relativePath.pop()
        }
      }
      this.relativePath.push({title: newPath})
      this.lastEvent = `Select nodes: ${newPath}`
      this.prevLevel = `${newLevel}`
      this.prevPath = `${newPath}`
    },
    showInfo (nodes, event) {
      this.fileInfo = []
      this.fileInfo.push(nodes)
    }
  },
  created () {
    for (var key in this.url) {
      axios({ method: 'GET',
        'url': this.proxyUrl + this.url[key],
        headers: {
          'content-type': 'application/json',
          'Access-Control-Allow-Origin': true
        }
      }).then(result => {
        this.jsonResult.push(result.data)
        this.setLocalStorage(this.jsonResult)
      }, error => {
        console.error(error)
      })
    }
  }
}
</script>
<style>
.v-content {
  background-color:#cfd3d4 !important
}
.v-navigation-drawer{
  background-color:rgb(9, 22, 29) !important
}
.v-breadcrumbs {
  /* margin-left: -303px; */
  margin-top: -250px;
}
</style>
