<template>
  <div class="card w-2/3 p-10">
    <Toast />
    <FileUpload
      @uploader="onUpload"
      @clear="onClear"
      :multiple="true"
      accept="text/xml"
      :maxFileSize="1000000"
      customUpload
      mode="advanced"
      chooseLabel="Subir"
      uploadLabel="Descargar"
      cancelLabel="Cancelar"
    >
      <template #content="{ files, removeFileCallback }">
        <div class="flex flex-col gap-8 pt-4">
          <div v-if="files.length > 0" class="flex flex-wrap gap-4">
            <VirtualScroller
              :items="files"
              :itemSize="50"
              class="border border-surface-200 dark:border-surface-700 rounded w-full h-96"
            >
              <template v-slot:item="{ item, options }">
                <div :class="['flex justify-between p-2', { 'bg-gray-500 dark:bg-gray-800': options.odd }]">
                  <span class="font-semibold text-ellipsis whitespace-nowrap overflow-hidden mr-1">{{
                    item.name
                  }}</span>

                  <Button icon="pi pi-times" @click="removeFileCallback(item)" outlined rounded severity="danger" />
                </div>
              </template>
            </VirtualScroller>
          </div>
        </div>
      </template>
      <template #empty>
        <span>Arrastra y suelta archivos aquí para subirlos</span>
      </template>
    </FileUpload>
  </div>
</template>

<script src="./UploadFile.ts" lang="ts" />
