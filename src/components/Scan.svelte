<script lang="ts">
	import { Heading, Tabs, TabItem } from 'flowbite-svelte';
	import FileManager from '$components/FileManager.svelte';
	import BucketManager from '$components/BucketManager.svelte';
</script>

<div class="flex w-full flex-col p-4">
	<Heading tag="h1" class="mb-4" customSize="text-4xl font-extrabold  md:text-5xl lg:text-6xl"
		>AI-powered Document Scanner</Heading
	>
	<Tabs tabStyle="underline" contentClass="p-0">
		<TabItem open>
			<span slot="title">BOL</span>
			<FileManager
				tableName="tbl_images"
				bucketName="bucket_images"
				imageType="BOL"
				fileType="jpg"
			/>
		</TabItem>
		<TabItem open>
			<span slot="title">Meter</span>
			<FileManager
				tableName="tbl_images"
				bucketName="bucket_images"
				imageType="BOL"
				fileType="jpg"
			/>
		</TabItem>
		<TabItem>
			<span slot="title">BOL Bucket</span>
			<BucketManager
				tableName="tbl_images"
				bucketName="bucket_images"
				imageType="BOL"
				fileType="jpg"
			/>
		</TabItem>
		<TabItem>
			<span slot="title">Meter Bucket</span>
			<BucketManager
				tableName="tbl_images"
				bucketName="bucket_images"
				imageType="Meter"
				fileType="jpg"
			/>
		</TabItem>
		<div class="flex flex-1 justify-end"></div>
	</Tabs>
</div>
