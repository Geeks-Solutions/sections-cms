<template>
  <div>
	
	<div id="title" class="flex flex-col items-start justify-start mt-8">
	  <label class="mr-4 font-bold">{{ $t("Title") }}</label>
	  <wysiwyg :html="settings[0][siteLang].title" @settingsUpdate="updateTitle"/>
	  <span v-show="errors.title === true && siteLang === 'en'" class="text-error text-sm pt-2 pl-2">{{ $t('requiredField') }}</span>
	</div>
	
	<div id="subTitle" class="flex flex-col items-start justify-start mt-8">
	  <label class="mr-4 font-bold">{{ $t("SubTitle") }}</label>
	  <wysiwyg :html="settings[0][siteLang].subTitle" @settingsUpdate="updateSubTitle"/>
	  <span v-show="errors.subTitle === true && siteLang === 'en'" class="text-error text-sm pt-2 pl-2">{{ $t('requiredField') }}</span>
	</div>
	
	
	<!--    Free-->
	<fieldset class="fieldSetStyle border border-solid border-gray-300 p-3 mt-2">
	  <legend class="w-auto px-16">{{ $t("freeBlock") }}</legend>
	  <!--  EN-->
	  <div id="freeTitle" class="flex flex-col items-start justify-start mt-8">
		<label class="mr-4 font-bold">{{ $t("Free Title") }}</label>
		<input
			 v-model="settings[0][siteLang].freeTitle"
			 type="text"
			 value=""
			 :placeholder="$t('Free Title')"
			 class="
            py-4
            pl-6
            border border-FieldGray
            rounded-xl
            h-48px
            w-344px
            focus:outline-none
          "
		/>
		<span v-show="errors.freeTitle === true && siteLang === 'en'" class="text-error text-sm pt-2 pl-2">{{ $t('requiredField') }}</span>
	  </div>
	  
	  <!--  EN-->
	  <div class="flex flex-col items-start justify-start mt-8">
		<label class="mr-4 font-bold">{{ $t("Free Description") }}</label>
		<wysiwyg :html="settings[0][siteLang].freeDescription" @settingsUpdate="updateFreeDescription"/>
		<span v-show="errors.freeDescription === true && siteLang === 'en'" class="text-error text-sm pt-2 pl-2">{{ $t('requiredField') }}</span>
	  </div>
	  
	  
	  <!--  EN-->
	  <div id="freePrice" class="flex flex-col items-start justify-start mt-8">
		<label class="mr-4 font-bold">{{ $t("Free Price") }}</label>
		<input
			 v-model="settings[0].freePrice"
			 type="text"
			 value=""
			 :placeholder="$t('Free Price')"
			 class="
            py-4
            pl-6
            border border-FieldGray
            rounded-xl
            h-48px
            w-344px
            focus:outline-none
          "
		/>
		<span v-show="errors.freePrice === true && siteLang === 'en'" class="text-error text-sm pt-2 pl-2">{{ $t('requiredField') }}</span>
	  </div>
	  
	  <!--  EN-->
	  <div id="freeDate" class="flex flex-col items-start justify-start mt-8">
		<label class="mr-4 font-bold">{{ $t("Free Date") }}</label>
		<input
			 v-model="settings[0][siteLang].freeDate"
			 type="text"
			 value=""
			 :placeholder="$t('Free Date')"
			 class="
            py-4
            pl-6
            border border-FieldGray
            rounded-xl
            h-48px
            w-344px
            focus:outline-none
          "
		/>
		<span v-show="errors.freeDate === true && siteLang === 'en'" class="text-error text-sm pt-2 pl-2">{{ $t('requiredField') }}</span>
	  </div>
	  
	  <!--  EN-->
	  <div class="flex flex-col items-start justify-start mt-8">
		<label class="mr-4 font-bold">{{ $t("Free Pages Number") }}</label>
		<input
			 v-model="settings[0].freePagesNumber"
			 type="text"
			 value=""
			 :placeholder="$t('Free Pages Number')"
			 class="
            py-4
            pl-6
            border border-FieldGray
            rounded-xl
            h-48px
            w-344px
            focus:outline-none
          "
		/>
		<span v-show="errors.freePagesNumber === true && siteLang === 'en'" class="text-error text-sm pt-2 pl-2">{{ $t('requiredField') }}</span>
	  </div>
	  
	  <!--  EN-->
	  <div class="flex flex-col items-start justify-start mt-8">
		<label class="mr-4 font-bold">{{ $t("Free Link") }}</label>
		<input
			 v-model="settings[0][siteLang].freeLink"
			 type="text"
			 value=""
			 :placeholder="$t('Free Link')"
			 class="
            py-4
            pl-6
            border border-FieldGray
            rounded-xl
            h-48px
            w-344px
            focus:outline-none
          "
		/>
		<span v-show="errors.freeLink === true && siteLang === 'en'" class="text-error text-sm pt-2 pl-2">{{ $t('requiredField') }}</span>
	  </div>
	  
	  <!--  EN-->
	  <div class="flex flex-col items-start justify-start mt-8">
		<label class="mr-4 font-bold">{{ $t("Free Features (separated by -)") }}</label>
		<textarea
			 v-model="settings[0][siteLang].freeFeatures"
			 :placeholder="$t('Free Features')"
			 class="
            py-4
            pl-6
            border border-FieldGray
            rounded-xl
            h-200px
            w-344px
            focus:outline-none
          "
		/>
	  </div>
	  
	  <div class="flex flex-col items-start justify-start mt-8">
		<label class="mr-4 font-bold">{{ $t("Free Start Label") }}</label>
		<input
			 v-model="settings[0][siteLang].freeStartLabel"
			 type="text"
			 value=""
			 :placeholder="$t('Free Start Label')"
			 class="
            py-4
            pl-6
            border border-FieldGray
            rounded-xl
            h-48px
            w-344px
            focus:outline-none
          "
		/>
	  </div>
	  
	  <div class="flex flex-col items-start justify-start mt-8">
		<label class="mr-4 font-bold">{{ $t("Free Start Link") }}</label>
		<input
			 v-model="settings[0][siteLang].freeStartLink"
			 type="text"
			 value=""
			 :placeholder="$t('Free Start Link')"
			 class="
            py-4
            pl-6
            border border-FieldGray
            rounded-xl
            h-48px
            w-344px
            focus:outline-none
          "
		/>
		<span v-show="errors.freeStartLink === true && siteLang === 'en'" class="text-error text-sm pt-2 pl-2">{{ $t('requiredField') }}</span>
	  </div>
	  
	  <div id="freeMedia" class="mt-8">
		<UploadMedia :media-label="$t('Free Media')" :upload-text="$t('Upload')" :change-text="$t('Change')" :seo-tag="$t('seoTag')" :media="Object.keys(settings[0].freeMedia).length > 0 ? [settings[0].freeMedia] : []" @uploadContainerClicked="mediaFieldKey = 'freeMedia'; $emit('openMediaModal', Object.keys(settings[0].freeMedia).length > 0 ? settings[0].freeMedia.media_id : null)" @removeUploadedImage="mediaFieldKey = 'freeMedia'; removeMedia()" />
		<span v-if="errors.freeMedia === true" class="flex text-error text-sm pt-2 pl-2">{{ $t('requiredField') }}</span>
	  </div>
	  
	  <div class="flex flex-col items-start justify-start mt-8">
		<label class="mr-4 pb-2 font-bold">{{ $t("mostPopular") }}</label>
		<input
			 v-model="settings[0].freeMostPopular"
			 type="checkbox"
			 value=""
			 :placeholder="$t('mostPopular')"
			 class="
            h-25px
            w-25px
            pl-6
            border border-FieldGray
            rounded-xl
            focus:outline-none
          "
		/>
	  </div>
	
	</fieldset>
	
	
	<!--    Standard-->
	<fieldset class="fieldSetStyle border border-solid border-gray-300 p-3 mt-2">
	  <legend class="w-auto px-16">{{ $t("standardBlock") }}</legend>
	  <!--  EN    -->
	  <div id="standardTitle" class="flex flex-col items-start justify-start mt-8">
		<label class="mr-4 font-bold">{{ $t("Standard Title") }}</label>
		<input
			 v-model="settings[0][siteLang].standardTitle"
			 type="text"
			 value=""
			 :placeholder="$t('Standard Title')"
			 class="
            py-4
            pl-6
            border border-FieldGray
            rounded-xl
            h-48px
            w-344px
            focus:outline-none
          "
		/>
		<span v-show="errors.standardTitle === true && siteLang === 'en'" class="text-error text-sm pt-2 pl-2">{{ $t('requiredField') }}</span>
	  </div>
	  
	  <!--  EN    -->
	  <div class="flex flex-col items-start justify-start mt-8">
		<label class="mr-4 font-bold">{{ $t("Standard Description") }}</label>
		<input
			 v-model="settings[0][siteLang].standardDescription"
			 type="text"
			 value=""
			 :placeholder="$t('Standard Description')"
			 class="
            py-4
            pl-6
            border border-FieldGray
            rounded-xl
            h-48px
            w-344px
            focus:outline-none
          "
		/>
		<span v-show="errors.standardDescription === true && siteLang === 'en'" class="text-error text-sm pt-2 pl-2">{{ $t('requiredField') }}</span>
	  </div>
	  
	  <!--  EN    -->
	  <div id="standardPrice" class="flex flex-col items-start justify-start mt-8">
		<label class="mr-4 font-bold">{{ $t("Standard Price") }}</label>
		<input
			 v-model="settings[0].standardPrice"
			 type="text"
			 value=""
			 :placeholder="$t('Standard Price')"
			 class="
            py-4
            pl-6
            border border-FieldGray
            rounded-xl
            h-48px
            w-344px
            focus:outline-none
          "
		/>
		<span v-show="errors.standardPrice === true && siteLang === 'en'" class="text-error text-sm pt-2 pl-2">{{ $t('requiredField') }}</span>
	  </div>
	  
	  <!--  EN    -->
	  <div id="standardDate" class="flex flex-col items-start justify-start mt-8">
		<label class="mr-4 font-bold">{{ $t("Standard Date") }}</label>
		<input
			 v-model="settings[0][siteLang].standardDate"
			 type="text"
			 value=""
			 :placeholder="$t('Standard Date')"
			 class="
            py-4
            pl-6
            border border-FieldGray
            rounded-xl
            h-48px
            w-344px
            focus:outline-none
          "
		/>
		<span v-show="errors.standardDate === true && siteLang === 'en'" class="text-error text-sm pt-2 pl-2">{{ $t('requiredField') }}</span>
	  </div>
	  
	  <!--  EN    -->
	  <div class="flex flex-col items-start justify-start mt-8">
		<label class="mr-4 font-bold">{{ $t("Standard Pages Number") }}</label>
		<input
			 v-model="settings[0].standardPagesNumber"
			 type="text"
			 value=""
			 :placeholder="$t('Standard Pages Number')"
			 class="
            py-4
            pl-6
            border border-FieldGray
            rounded-xl
            h-48px
            w-344px
            focus:outline-none
          "
		/>
		<span v-show="errors.standardPagesNumber === true && siteLang === 'en'" class="text-error text-sm pt-2 pl-2">{{ $t('requiredField') }}</span>
	  </div>
	  
	  <!--  EN    -->
	  <div class="flex flex-col items-start justify-start mt-8">
		<label class="mr-4 font-bold">{{ $t("Standard Link") }}</label>
		<input
			 v-model="settings[0][siteLang].standardLink"
			 type="text"
			 value=""
			 :placeholder="$t('Standard Link')"
			 class="
            py-4
            pl-6
            border border-FieldGray
            rounded-xl
            h-48px
            w-344px
            focus:outline-none
          "
		/>
		<span v-show="errors.standardLink === true && siteLang === 'en'" class="text-error text-sm pt-2 pl-2">{{ $t('requiredField') }}</span>
	  </div>
	  
	  <!--  EN    -->
	  <div class="flex flex-col items-start justify-start mt-8">
		<label class="mr-4 font-bold">{{ $t("Standard Features (separated by -)") }}</label>
		<textarea
			 v-model="settings[0][siteLang].standardFeatures"
			 :placeholder="$t('Standard Features')"
			 class="
            py-4
            pl-6
            border border-FieldGray
            rounded-xl
            h-200px
            w-344px
            focus:outline-none
          "
		/>
	  </div>
	  
	  <div class="flex flex-col items-start justify-start mt-8">
		<label class="mr-4 font-bold">{{ $t("standardStartLabel") }}</label>
		<input
			 v-model="settings[0][siteLang].standardStartLabel"
			 type="text"
			 value=""
			 :placeholder="$t('standardStartLabel')"
			 class="
            py-4
            pl-6
            border border-FieldGray
            rounded-xl
            h-48px
            w-344px
            focus:outline-none
          "
		/>
	  </div>
	  
	  <div class="flex flex-col items-start justify-start mt-8">
		<label class="mr-4 font-bold">{{ $t("standardStartLink") }}</label>
		<input
			 v-model="settings[0][siteLang].standardStartLink"
			 type="text"
			 value=""
			 :placeholder="$t('standardStartLink')"
			 class="
            py-4
            pl-6
            border border-FieldGray
            rounded-xl
            h-48px
            w-344px
            focus:outline-none
          "
		/>
		<span v-show="errors.standardStartLink === true && siteLang === 'en'" class="text-error text-sm pt-2 pl-2">{{ $t('requiredField') }}</span>
	  </div>
	  
	  <div id="standardMedia" class="mt-8">
		<UploadMedia :media-label="$t('Standard Media')" :upload-text="$t('Upload')" :change-text="$t('Change')" :seo-tag="$t('seoTag')" :media="Object.keys(settings[0].standardMedia).length > 0 ? [settings[0].standardMedia] : []" @uploadContainerClicked="mediaFieldKey = 'standardMedia'; $emit('openMediaModal', Object.keys(settings[0].standardMedia).length > 0 ? settings[0].standardMedia.media_id : null)" @removeUploadedImage="mediaFieldKey = 'standardMedia'; removeMedia()" />
		<span v-if="errors.standardMedia === true" class="flex text-error text-sm pt-2 pl-2">{{ $t('requiredField') }}</span>
	  </div>
	  
	  <div class="flex flex-col items-start justify-start mt-8">
		<label class="mr-4 pb-2 font-bold">{{ $t("mostPopular") }}</label>
		<input
			 v-model="settings[0].standardMostPopular"
			 type="checkbox"
			 value=""
			 :placeholder="$t('mostPopular')"
			 class="
            h-25px
            w-25px
            pl-6
            border border-FieldGray
            rounded-xl
            focus:outline-none
          "
		/>
	  </div>
	
	</fieldset>
	
	
	<!--    Corporate-->
	<fieldset class="fieldSetStyle border border-solid border-gray-300 p-3 mt-2">
	  <legend class="w-auto px-16">{{ $t("corporateBlock") }}</legend>
	  <!--  EN    -->
	  <div id="corporateTitle" class="flex flex-col items-start justify-start mt-8">
		<label class="mr-4 font-bold">{{ $t("Corporate Title") }}</label>
		<input
			 v-model="settings[0][siteLang].corporateTitle"
			 type="text"
			 value=""
			 :placeholder="$t('Corporate Title')"
			 class="
            py-4
            pl-6
            border border-FieldGray
            rounded-xl
            h-48px
            w-344px
            focus:outline-none
          "
		/>
		<span v-show="errors.corporateTitle === true && siteLang === 'en'" class="text-error text-sm pt-2 pl-2">{{ $t('requiredField') }}</span>
	  </div>
	  
	  <!--  EN    -->
	  <div class="flex flex-col items-start justify-start mt-8">
		<label class="mr-4 font-bold">{{ $t("Corporate Description") }}</label>
		<input
			 v-model="settings[0][siteLang].corporateDescription"
			 type="text"
			 value=""
			 :placeholder="$t('Corporate Description')"
			 class="
            py-4
            pl-6
            border border-FieldGray
            rounded-xl
            h-48px
            w-344px
            focus:outline-none
          "
		/>
		<span v-show="errors.corporateDescription === true && siteLang === 'en'" class="text-error text-sm pt-2 pl-2">{{ $t('requiredField') }}</span>
	  </div>
	  
	  <!--  EN    -->
	  <div id="corporatePrice" class="flex flex-col items-start justify-start mt-8">
		<label class="mr-4 font-bold">{{ $t("Corporate Price") }}</label>
		<input
			 v-model="settings[0].corporatePrice"
			 type="text"
			 value=""
			 :placeholder="$t('Corporate Price')"
			 class="
            py-4
            pl-6
            border border-FieldGray
            rounded-xl
            h-48px
            w-344px
            focus:outline-none
          "
		/>
		<span v-show="errors.corporatePrice === true && siteLang === 'en'" class="text-error text-sm pt-2 pl-2">{{ $t('requiredField') }}</span>
	  </div>
	  
	  <!--  EN    -->
	  <div id="corporateDate" class="flex flex-col items-start justify-start mt-8">
		<label class="mr-4 font-bold">{{ $t("Corporate Date") }}</label>
		<input
			 v-model="settings[0][siteLang].corporateDate"
			 type="text"
			 value=""
			 :placeholder="$t('Corporate Date')"
			 class="
            py-4
            pl-6
            border border-FieldGray
            rounded-xl
            h-48px
            w-344px
            focus:outline-none
          "
		/>
		<span v-show="errors.corporateDate === true && siteLang === 'en'" class="text-error text-sm pt-2 pl-2">{{ $t('requiredField') }}</span>
	  </div>
	  
	  <!--  EN    -->
	  <div class="flex flex-col items-start justify-start mt-8">
		<label class="mr-4 font-bold">{{ $t("Corporate Pages Number") }}</label>
		<input
			 v-model="settings[0].corporatePagesNumber"
			 type="text"
			 value=""
			 :placeholder="$t('Corporate Pages Number')"
			 class="
            py-4
            pl-6
            border border-FieldGray
            rounded-xl
            h-48px
            w-344px
            focus:outline-none
          "
		/>
		<span v-show="errors.corporatePagesNumber === true && siteLang === 'en'" class="text-error text-sm pt-2 pl-2">{{ $t('requiredField') }}</span>
	  </div>
	  
	  <!--  EN    -->
	  <div class="flex flex-col items-start justify-start mt-8">
		<label class="mr-4 font-bold">{{ $t("Corporate Link") }}</label>
		<input
			 v-model="settings[0][siteLang].corporateLink"
			 type="text"
			 value=""
			 :placeholder="$t('Corporate Link')"
			 class="
            py-4
            pl-6
            border border-FieldGray
            rounded-xl
            h-48px
            w-344px
            focus:outline-none
          "
		/>
		<span v-show="errors.corporateLink === true && siteLang === 'en'" class="text-error text-sm pt-2 pl-2">{{ $t('requiredField') }}</span>
	  </div>
	  
	  <!--  EN    -->
	  <div class="flex flex-col items-start justify-start mt-8">
		<label class="mr-4 font-bold">{{ $t("Corporate Features (separated by -)") }}</label>
		<textarea
			 v-model="settings[0][siteLang].corporateFeatures"
			 :placeholder="$t('Corporate Features')"
			 class="
            py-4
            pl-6
            border border-FieldGray
            rounded-xl
            h-200px
            w-344px
            focus:outline-none
          "
		/>
	  </div>
	  
	  <div class="flex flex-col items-start justify-start mt-8">
		<label class="mr-4 font-bold">{{ $t("corporateStartLabel") }}</label>
		<input
			 v-model="settings[0][siteLang].corporateStartLabel"
			 type="text"
			 value=""
			 :placeholder="$t('corporateStartLabel')"
			 class="
            py-4
            pl-6
            border border-FieldGray
            rounded-xl
            h-48px
            w-344px
            focus:outline-none
          "
		/>
	  </div>
	  
	  <div class="flex flex-col items-start justify-start mt-8">
		<label class="mr-4 font-bold">{{ $t("corporateStartLink") }}</label>
		<input
			 v-model="settings[0][siteLang].corporateStartLink"
			 type="text"
			 value=""
			 :placeholder="$t('corporateStartLink')"
			 class="
            py-4
            pl-6
            border border-FieldGray
            rounded-xl
            h-48px
            w-344px
            focus:outline-none
          "
		/>
		<span v-show="errors.corporateStartLink === true && siteLang === 'en'" class="text-error text-sm pt-2 pl-2">{{ $t('requiredField') }}</span>
	  </div>
	  
	  <div id="corporateMedia" class="mt-8">
		<UploadMedia :media-label="$t('Corporate Media')" :upload-text="$t('Upload')" :change-text="$t('Change')" :seo-tag="$t('seoTag')" :media="Object.keys(settings[0].corporateMedia).length > 0 ? [settings[0].corporateMedia] : []" @uploadContainerClicked="mediaFieldKey = 'corporateMedia'; $emit('openMediaModal', Object.keys(settings[0].corporateMedia).length > 0 ? settings[0].corporateMedia.media_id : null)" @removeUploadedImage="mediaFieldKey = 'corporateMedia'; removeMedia()" />
		<span v-if="errors.corporateMedia === true" class="flex text-error text-sm pt-2 pl-2">{{ $t('requiredField') }}</span>
	  </div>
	  
	  <div class="flex flex-col items-start justify-start mt-8">
		<label class="mr-4 pb-2 font-bold">{{ $t("mostPopular") }}</label>
		<input
			 v-model="settings[0].corporateMostPopular"
			 type="checkbox"
			 value=""
			 :placeholder="$t('mostPopular')"
			 class="
            h-25px
            w-25px
            pl-6
            border border-FieldGray
            rounded-xl
            focus:outline-none
          "
		/>
	  </div>
	
	</fieldset>
	
	
	<!--    Entreprise-->
	<fieldset class="fieldSetStyle border border-solid border-gray-300 p-3 mt-2">
	  <legend class="w-auto px-16">{{ $t("entrepriseBlock") }}</legend>
	  <!--  EN    -->
	  <div id="entrepriseTitle" class="flex flex-col items-start justify-start mt-8">
		<label class="mr-4 font-bold">{{ $t("Entreprise Title") }}</label>
		<input
			 v-model="settings[0][siteLang].entrepriseTitle"
			 type="text"
			 value=""
			 :placeholder="$t('Entreprise Title')"
			 class="
            py-4
            pl-6
            border border-FieldGray
            rounded-xl
            h-48px
            w-344px
            focus:outline-none
          "
		/>
		<span v-show="errors.entrepriseTitle === true && siteLang === 'en'" class="text-error text-sm pt-2 pl-2">{{ $t('requiredField') }}</span>
	  </div>
	  
	  <!--  EN    -->
	  <div class="flex flex-col items-start justify-start mt-8">
		<label class="mr-4 font-bold">{{ $t("Entreprise Description") }}</label>
		<input
			 v-model="settings[0][siteLang].entrepriseDescription"
			 type="text"
			 value=""
			 :placeholder="$t('Entreprise Description')"
			 class="
            py-4
            pl-6
            border border-FieldGray
            rounded-xl
            h-48px
            w-344px
            focus:outline-none
          "
		/>
		<span v-show="errors.entrepriseDescription === true && siteLang === 'en'" class="text-error text-sm pt-2 pl-2">{{ $t('requiredField') }}</span>
	  </div>
	  
	  <!--  EN    -->
	  <div class="flex flex-col items-start justify-start mt-8">
		<label class="mr-4 font-bold">{{ $t("Entreprise Price") }}</label>
		<input
			 v-model="settings[0][siteLang].entreprisePrice"
			 type="text"
			 value=""
			 :placeholder="$t('Entreprise Price')"
			 class="
            py-4
            pl-6
            border border-FieldGray
            rounded-xl
            h-48px
            w-344px
            focus:outline-none
          "
		/>
		<span v-show="errors.entreprisePrice === true && siteLang === 'en'" class="text-error text-sm pt-2 pl-2">{{ $t('requiredField') }}</span>
	  </div>
	  
	  <!--  EN    -->
	  <div id="entrepriseDate" class="flex flex-col items-start justify-start mt-8">
		<label class="mr-4 font-bold">{{ $t("Entreprise Date") }}</label>
		<input
			 v-model="settings[0][siteLang].entrepriseDate"
			 type="text"
			 value=""
			 :placeholder="$t('Entreprise Date')"
			 class="
            py-4
            pl-6
            border border-FieldGray
            rounded-xl
            h-48px
            w-344px
            focus:outline-none
          "
		/>
		<span v-show="errors.entrepriseDate === true && siteLang === 'en'" class="text-error text-sm pt-2 pl-2">{{ $t('requiredField') }}</span>
	  </div>
	  
	  <div class="flex flex-col items-start justify-start mt-8">
		<label class="mr-4 font-bold">{{ $t("Entreprise Pages Number") }}</label>
		<input
			 v-model="settings[0].entreprisePagesNumber"
			 type="text"
			 value=""
			 :placeholder="$t('Entreprise Pages Number')"
			 class="
            py-4
            pl-6
            border border-FieldGray
            rounded-xl
            h-48px
            w-344px
            focus:outline-none
          "
		/>
		<span v-show="errors.entreprisePagesNumber === true && siteLang === 'en'" class="text-error text-sm pt-2 pl-2">{{ $t('requiredField') }}</span>
	  </div>
	  
	  
	  <!--  EN    -->
	  <div class="flex flex-col items-start justify-start mt-8">
		<label class="mr-4 font-bold">{{ $t("Entreprise Link") }}</label>
		<input
			 v-model="settings[0][siteLang].entrepriseLink"
			 type="text"
			 value=""
			 :placeholder="$t('Entreprise Link')"
			 class="
            py-4
            pl-6
            border border-FieldGray
            rounded-xl
            h-48px
            w-344px
            focus:outline-none
          "
		/>
		<span v-show="errors.entrepriseLink === true && siteLang === 'en'" class="text-error text-sm pt-2 pl-2">{{ $t('requiredField') }}</span>
	  </div>
	  
	  <!--  EN    -->
	  <div class="flex flex-col items-start justify-start mt-8">
		<label class="mr-4 font-bold">{{ $t("Entreprise Custom Feature") }}</label>
		<input
			 v-model="settings[0][siteLang].entrepriseCustomFeature"
			 type="text"
			 value=""
			 :placeholder="$t('Entreprise Custom Feature')"
			 class="
            py-4
            pl-6
            border border-FieldGray
            rounded-xl
            h-48px
            w-344px
            focus:outline-none
          "
		/>
	  </div>
	  
	  <!--  EN    -->
	  <div class="flex flex-col items-start justify-start mt-8">
		<label class="mr-4 font-bold">{{ $t("Entreprise Features (separated by -)") }}</label>
		<textarea
			 v-model="settings[0][siteLang].entrepriseFeatures"
			 :placeholder="$t('Entreprise Features')"
			 class="
            py-4
            pl-6
            border border-FieldGray
            rounded-xl
            h-200px
            w-344px
            focus:outline-none
          "
		/>
	  </div>
	  
	  <div class="flex flex-col items-start justify-start mt-8">
		<label class="mr-4 font-bold">{{ $t("entrepriseStartLabel") }}</label>
		<input
			 v-model="settings[0][siteLang].entrepriseStartLabel"
			 type="text"
			 value=""
			 :placeholder="$t('entrepriseStartLabel')"
			 class="
            py-4
            pl-6
            border border-FieldGray
            rounded-xl
            h-48px
            w-344px
            focus:outline-none
          "
		/>
	  </div>
	  
	  <div class="flex flex-col items-start justify-start mt-8">
		<label class="mr-4 font-bold">{{ $t("entrepriseStartLink") }}</label>
		<input
			 v-model="settings[0][siteLang].entrepriseStartLink"
			 type="text"
			 value=""
			 :placeholder="$t('entrepriseStartLink')"
			 class="
            py-4
            pl-6
            border border-FieldGray
            rounded-xl
            h-48px
            w-344px
            focus:outline-none
          "
		/>
		<span v-show="errors.entrepriseStartLink === true && siteLang === 'en'" class="text-error text-sm pt-2 pl-2">{{ $t('requiredField') }}</span>
	  </div>
	  
	  <div id="entrepriseMedia" class="mt-8">
		<UploadMedia :media-label="$t('Entreprise Media')" :upload-text="$t('Upload')" :change-text="$t('Change')" :seo-tag="$t('seoTag')" :media="Object.keys(settings[0].entrepriseMedia).length > 0 ? [settings[0].entrepriseMedia] : []" @uploadContainerClicked="mediaFieldKey = 'entrepriseMedia'; $emit('openMediaModal', Object.keys(settings[0].entrepriseMedia).length > 0 ? settings[0].entrepriseMedia.media_id : null)" @removeUploadedImage="mediaFieldKey = 'entrepriseMedia'; removeMedia()" />
		<span v-if="errors.entrepriseMedia === true" class="flex text-error text-sm pt-2 pl-2">{{ $t('requiredField') }}</span>
	  </div>
	  
	  <div class="flex flex-col items-start justify-start mt-8">
		<label class="mr-4 pb-2 font-bold">{{ $t("mostPopular") }}</label>
		<input
			 v-model="settings[0][siteLang].entrepriseMostPopular"
			 type="checkbox"
			 value=""
			 :placeholder="$t('mostPopular')"
			 class="
            h-25px
            w-25px
            pl-6
            border border-FieldGray
            rounded-xl
            focus:outline-none
          "
		/>
	  </div>
	
	</fieldset>
	
	
	<!--    Others-->
	<div class="flex flex-col items-start justify-start mt-8">
	  <label class="mr-4 font-bold">{{ $t("Pages Label") }}</label>
	  <input
		   v-model="settings[0][siteLang].pagesLabel"
		   type="text"
		   value=""
		   :placeholder="$t('Pages Label')"
		   class="
            py-4
            pl-6
            border border-FieldGray
            rounded-xl
            h-48px
            w-344px
            focus:outline-none
          "
	  />
	  <span v-show="errors.pagesLabel === true && siteLang === 'en'" class="text-error text-sm pt-2 pl-2">{{ $t('requiredField') }}</span>
	</div>
	
	<div class="flex flex-col items-start justify-start mt-8">
	  <label class="mr-4 font-bold">{{ $t("Know More Label") }}</label>
	  <input
		   v-model="settings[0][siteLang].knowMoreLabel"
		   type="text"
		   value=""
		   :placeholder="$t('Know More Label')"
		   class="
            py-4
            pl-6
            border border-FieldGray
            rounded-xl
            h-48px
            w-344px
            focus:outline-none
          "
	  />
	
	</div>
	
	<span v-show="!Object.values(errors).every((v) => v === false) && siteLang === 'fr'" id="required-fields" class="text-error text-sm pt-2 pl-2">{{ $t('checkRequiredField') }}</span>
  
  </div>
</template>

<script>
import UploadMedia from "@geeks.solutions/nuxt-sections/lib/src/components/Medias/UploadMedia.vue";
import wysiwyg from "@geeks.solutions/nuxt-sections/lib/src/components/Editor/wysiwyg.vue";
import {getFormsKeysTranslation, scrollToFirstError} from "@/utils/constants";

export default {
  name: 'TitleTextMedia',
  components: {
	UploadMedia,
	wysiwyg
  },
  props: {
	selectedLang: {
	  type: String,
	  default: 'en'
	},
	selectedMedia: {},
	locales: {
	  type: Array,
	  default() {
		return []
	  }
	}
  },
  data() {
	return {
	  settings: [
		{
		  en: {
			title: "",
			subTitle: "",
			freeTitle: "",
			freeDescription: "",
			freeDate: "",
			freeLink: "",
			freeStartLabel: "",
			freeStartLink: "",
			standardTitle: "",
			standardDescription: "",
			standardDate: "",
			standardLink: "",
			standardStartLabel: "",
			standardStartLink: "",
			corporateTitle: "",
			corporateDescription: "",
			corporateDate: "",
			corporateLink: "",
			corporateStartLabel: "",
			corporateStartLink: "",
			entrepriseTitle: "",
			entrepriseDescription: "",
			entreprisePrice: "",
			entrepriseDate: "",
			entrepriseLink: "",
			entrepriseStartLabel: "",
			entrepriseStartLink: "",
			freeFeatures: "",
			standardFeatures: "",
			corporateFeatures: "",
			entrepriseFeatures: "",
			entrepriseCustomFeature: "",
			pagesLabel: "",
			knowMoreLabel: ""
		  },
		  fr: {
			title: "",
			subTitle: "",
			freeTitle: "",
			freeDescription: "",
			freeDate: "",
			freeLink: "",
			freeStartLabel: "",
			freeStartLink: "",
			standardTitle: "",
			standardDescription: "",
			standardDate: "",
			standardLink: "",
			standardStartLabel: "",
			standardStartLink: "",
			corporateTitle: "",
			corporateDescription: "",
			corporateDate: "",
			corporateLink: "",
			corporateStartLabel: "",
			corporateStartLink: "",
			entrepriseTitle: "",
			entrepriseDescription: "",
			entreprisePrice: "",
			entrepriseDate: "",
			entrepriseLink: "",
			entrepriseStartLabel: "",
			entrepriseStartLink: "",
			freeFeatures: "",
			standardFeatures: "",
			corporateFeatures: "",
			entrepriseFeatures: "",
			entrepriseCustomFeature: "",
			pagesLabel: "",
			knowMoreLabel: ""
		  },
		  freePrice: "",
		  freePagesNumber: "",
		  freeMostPopular: false,
		  freeMedia: {
			media_id: "",
			url: "",
			seo_tag: "",
			files: [
			  {
				filename: "",
				url: ""
			  }
			]
		  },
		  standardPrice: "",
		  standardPagesNumber: "",
		  standardMostPopular: false,
		  standardMedia: {
			media_id: "",
			url: "",
			seo_tag: "",
			files: [
			  {
				filename: "",
				url: ""
			  }
			]
		  },
		  corporatePrice: "",
		  corporatePagesNumber: "",
		  corporateMostPopular: false,
		  corporateMedia: {
			media_id: "",
			url: "",
			seo_tag: "",
			files: [
			  {
				filename: "",
				url: ""
			  }
			]
		  },
		  entreprisePrice: "",
		  entreprisePagesNumber: "",
		  entrepriseMostPopular: false,
		  entrepriseMedia: {
			media_id: "",
			url: "",
			seo_tag: "",
			files: [
			  {
				filename: "",
				url: ""
			  }
			]
		  }
		}
	  ],
	  file: "",
	  errors: {
		title: false,
		subTitle: false,
		freeTitle: false,
		freeDescription: false,
		freePrice: false,
		freeDate: false,
		freePagesNumber: false,
		freeLink: false,
		freeMedia: false,
		freeStartLabel: false,
		freeStartLink: false,
		standardTitle: false,
		standardDescription: false,
		standardPrice: false,
		standardDate: false,
		standardPagesNumber: false,
		standardLink: false,
		standardMedia: false,
		corporateTitle: false,
		corporateDescription: false,
		corporatePrice: false,
		corporateDate: false,
		corporatePagesNumber: false,
		corporateLink: false,
		corporateMedia: false,
		entrepriseTitle: false,
		entrepriseDate: false,
		entrepriseDescription: false,
		entreprisePagesNumber: false,
		entreprisePrice: false,
		entrepriseMedia: false,
		pagesLabel: false
	  },
	  isInProgress: false,
	  siteLang: 'en',
	  mediaFieldKey: ''
	}
  },
  watch: {
	selectedLang(val) {
	  this.siteLang = val
	},
	settings(val) {
	  if (!Array.isArray(val)) {
		this.settings = [val]
	  }
	  for(const mediaKey of ['freeMedia', 'standardMedia', 'corporateMedia', 'entrepriseMedia']) {
		if (!this.settings[0][mediaKey].media_id && !this.settings[0][mediaKey].error) {
		  this.settings[0][mediaKey].media_id = this.settings[0][mediaKey].id
		  delete this.settings[0][mediaKey].id
		  this.settings[0][mediaKey].url = this.settings[0][mediaKey].files[0].url
		} else if (this.settings[0][mediaKey].error) {
		  this.settings[0][mediaKey] = {}
		}
	  }
	  this.locales.forEach(lang => {
		if(!this.settings[0][lang]) {
		  this.settings[0][lang] = {
			title: "",
			subTitle: "",
			freeTitle: "",
			freeDescription: "",
			freeDate: "",
			freeLink: "",
			freeStartLabel: "",
			freeStartLink: "",
			standardTitle: "",
			standardDescription: "",
			standardDate: "",
			standardLink: "",
			standardStartLabel: "",
			standardStartLink: "",
			corporateTitle: "",
			corporateDescription: "",
			corporateDate: "",
			corporateLink: "",
			corporateStartLabel: "",
			corporateStartLink: "",
			entrepriseTitle: "",
			entrepriseDescription: "",
			entreprisePrice: "",
			entrepriseDate: "",
			entrepriseLink: "",
			entrepriseStartLabel: "",
			entrepriseStartLink: "",
			freeFeatures: "",
			standardFeatures: "",
			corporateFeatures: "",
			entrepriseFeatures: "",
			entrepriseCustomFeature: "",
			pagesLabel: "",
			knowMoreLabel: ""
		  }
		}
	  })
	  getFormsKeysTranslation(val)
	},
	selectedMedia(mediaObject) {
	  const media = {
		media_id: "",
		url: "",
		seo_tag: "",
		files: [
		  {
			filename: "",
			url: ""
		  }
		],
		headers: {}
	  };
	  media.files[0].url = mediaObject.files[0].url;
	  media.files[0].filename = mediaObject.files[0].filename;
	  media.media_id = mediaObject.id;
	  media.url = mediaObject.files[0].url;
	  media.seo_tag = mediaObject.seo_tag;
	  if (mediaObject.files[0].headers) {
		media.headers = mediaObject.files[0].headers
	  }
	  this.settings[0][this.mediaFieldKey] = media;
	  this.$emit('closeMediaModal')
	}
  },
  created() {
	this.locales.forEach(lang => {
	  this.settings[0][lang] = {
		title: "",
		subTitle: "",
		freeTitle: "",
		freeDescription: "",
		freeDate: "",
		freeLink: "",
		freeStartLabel: "",
		freeStartLink: "",
		standardTitle: "",
		standardDescription: "",
		standardDate: "",
		standardLink: "",
		standardStartLabel: "",
		standardStartLink: "",
		corporateTitle: "",
		corporateDescription: "",
		corporateDate: "",
		corporateLink: "",
		corporateStartLabel: "",
		corporateStartLink: "",
		entrepriseTitle: "",
		entrepriseDescription: "",
		entreprisePrice: "",
		entrepriseDate: "",
		entrepriseLink: "",
		entrepriseStartLabel: "",
		entrepriseStartLink: "",
		freeFeatures: "",
		standardFeatures: "",
		corporateFeatures: "",
		entrepriseFeatures: "",
		entrepriseCustomFeature: "",
		pagesLabel: "",
		knowMoreLabel: ""
	  }
	})
  },
  methods: {
	updateTitle(content) {
	  this.settings[0][this.siteLang].title = content
	},
	updateSubTitle(content) {
	  this.settings[0][this.siteLang].subTitle = content
	},
	updateFreeDescription(content) {
	  this.settings[0][this.siteLang].freeDescription = content
	},
	removeMedia() {
	  this.settings[0][this.mediaFieldKey] = {}
	},
	validate() {
	  let valid = true;
	  this.errors.title = false;
	  this.errors.subTitle = false;
	  this.errors.freeTitle = false;
	  this.errors.freeDescription = false;
	  this.errors.freePrice = false;
	  this.errors.freeDate = false;
	  this.errors.freePagesNumber = false;
	  this.errors.freeLink = false;
	  this.errors.freeMedia = false;
	  this.errors.standardTitle = false;
	  this.errors.standardDescription = false;
	  this.errors.standardPrice = false;
	  this.errors.standardDate = false;
	  this.errors.standardPagesNumber = false;
	  this.errors.standardLink = false;
	  this.errors.standardMedia = false;
	  this.errors.corporateTitle = false;
	  this.errors.corporateDescription = false;
	  this.errors.corporatePrice = false;
	  this.errors.corporateDate = false;
	  this.errors.corporatePagesNumber = false;
	  this.errors.corporateLink = false;
	  this.errors.corporateMedia = false;
	  this.errors.entrepriseTitle = false;
	  this.errors.entrepriseDescription = false;
	  this.errors.entrepriseMedia = false;
	  this.errors.pagesLabel = false;
	  if (!this.settings[0].en.title) {
		this.errors.title = true;
		valid = false;
	  }
	  if (!this.settings[0].en.subTitle) {
		this.errors.subTitle = true;
		valid = false;
	  }
	  if(!this.settings[0].en.freeTitle.trim()){
		this.errors.freeTitle = true;
		valid = false;
	  }
	  if(!this.settings[0].freePrice.trim()){
		this.errors.freePrice = true;
		valid = false;
	  }
	  if(!this.settings[0].en.freeDate.trim()){
		this.errors.freeDate = true;
		valid = false;
	  }
	  if(!this.settings[0].freeMedia.url){
		this.errors.freeMedia = true;
		valid = false;
	  }
	  if(!this.settings[0].en.standardTitle.trim()){
		this.errors.standardTitle = true;
		valid = false;
	  }
	  if(!this.settings[0].standardPrice.trim()){
		this.errors.standardPrice = true;
		valid = false;
	  }
	  if(!this.settings[0].en.standardDate.trim()){
		this.errors.standardDate = true;
		valid = false;
	  }
	  if(!this.settings[0].standardMedia.url){
		this.errors.standardMedia = true;
		valid = false;
	  }
	  if(!this.settings[0].en.corporateTitle.trim()){
		this.errors.corporateTitle = true;
		valid = false;
	  }
	  if(!this.settings[0].corporatePrice.trim()){
		this.errors.corporatePrice = true;
		valid = false;
	  }
	  if(!this.settings[0].en.corporateDate.trim()){
		this.errors.corporateDate = true;
		valid = false;
	  }
	  if(!this.settings[0].corporateMedia.url){
		this.errors.corporateMedia = true;
		valid = false;
	  }
	  if(!this.settings[0].en.entrepriseTitle.trim()){
		this.errors.entrepriseTitle = true;
		valid = false;
	  }
	  if(!this.settings[0].entrepriseMedia.url){
		this.errors.entrepriseMedia = true;
		valid = false;
	  }
	  if (!valid) {
		setTimeout(() => document.getElementById('required-fields').scrollIntoView(), 1000)
		this.$root.$emit("toast", {
		  type: "Error",
		  message: this.$t("fill-required-fields")
		});
		scrollToFirstError(this.errors)
	  }
	  return valid;
	},
  },
}
</script>

<style>
.shadow {
  box-shadow: 4px 2px 10px rgba(0, 0, 0, 0.1);
}
</style>
