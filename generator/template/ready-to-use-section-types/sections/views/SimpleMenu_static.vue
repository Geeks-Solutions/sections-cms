<template>
  <div class="simple-menu w-max p-8" v-if="settings">
	<ul>
	  <li v-for="(menuItem, idx) in settings.menu" :key="`simple-menu-${idx}`">
		<global-link :link="menuItem.link[lang] ? menuItem.link : { ...menuItem.page, en: '/' + menuItem.page.en, fr: '/' + menuItem.page.fr }" :lang="lang">
		  <p>
			{{ menuItem.label[lang] }}
		  </p>
		</global-link>
	  </li>
	</ul>
  </div>
</template>

<script>

export default {
  name: 'SimpleMenu',
  props: {
    section: {
      type: Object,
      default: () => {},
    },
    lang: {
      type: String,
      default: "en"
    },
	viewStructure: {
	  settings: [
		{
		  menu: [
			{
			  label: {
				en: 'title',
				fr: 'title'
			  },
			  link: {
				en: 'title',
				fr: 'title'
			  },
			  page: {
				en: 'title',
				fr: 'title'
			  }
			},
			{
			  label: {
				en: 'title',
				fr: 'title'
			  },
			  link: {
				en: 'title',
				fr: 'title'
			  },
			  page: {
				en: 'title',
				fr: 'title'
			  }
			},
			{
			  label: {
				en: 'title',
				fr: 'title'
			  },
			  link: {
				en: 'title',
				fr: 'title'
			  },
			  page: {
				en: 'title',
				fr: 'title'
			  }
			},
			{
			  label: {
				en: 'title',
				fr: 'title'
			  },
			  link: {
				en: 'title',
				fr: 'title'
			  },
			  page: {
				en: 'title',
				fr: 'title'
			  }
			},
			{
			  label: {
				en: 'title',
				fr: 'title'
			  },
			  link: {
				en: 'title',
				fr: 'title'
			  },
			  page: {
				en: 'title',
				fr: 'title'
			  }
			},
			{
			  label: {
				en: 'title',
				fr: 'title'
			  },
			  link: {
				en: 'title',
				fr: 'title'
			  },
			  page: {
				en: 'title',
				fr: 'title'
			  }
			},
			{
			  label: {
				en: 'title',
				fr: 'title'
			  },
			  link: {
				en: 'title',
				fr: 'title'
			  },
			  page: {
				en: 'title',
				fr: 'title'
			  }
			}
		  ]
		}
	  ]
	}
  },
  computed: {
	settings() {
	  if(Array.isArray(this.section.settings)) {
		return this.section.settings[0];
	  } else return this.section.settings
	},
  }
};
</script>

<style>
.simple-menu li {
  list-style: disc;
}
</style>
