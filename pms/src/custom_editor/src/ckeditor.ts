/**
 * @license Copyright (c) 2014-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

import { ClassicEditor } from '@ckeditor/ckeditor5-editor-classic';

import { Autoformat } from '@ckeditor/ckeditor5-autoformat';
import { Bold, Italic, Underline, Strikethrough } from '@ckeditor/ckeditor5-basic-styles';
import { BlockQuote } from '@ckeditor/ckeditor5-block-quote';
import { CloudServices } from '@ckeditor/ckeditor5-cloud-services';
import type { EditorConfig } from '@ckeditor/ckeditor5-core';
import { Essentials } from '@ckeditor/ckeditor5-essentials';
import { Heading } from '@ckeditor/ckeditor5-heading';
import { HorizontalLine } from '@ckeditor/ckeditor5-horizontal-line';
import { GeneralHtmlSupport } from '@ckeditor/ckeditor5-html-support';
import {
	Image,
	ImageCaption,
	ImageStyle,
	ImageToolbar,
	ImageUpload
} from '@ckeditor/ckeditor5-image';
import { Indent } from '@ckeditor/ckeditor5-indent';
import { Link } from '@ckeditor/ckeditor5-link';
import { List } from '@ckeditor/ckeditor5-list';
import { MediaEmbed } from '@ckeditor/ckeditor5-media-embed';
import { Paragraph } from '@ckeditor/ckeditor5-paragraph';
import { PasteFromOffice } from '@ckeditor/ckeditor5-paste-from-office';
import { RemoveFormat } from '@ckeditor/ckeditor5-remove-format';
import { SourceEditing } from '@ckeditor/ckeditor5-source-editing';
import { SpecialCharacters, SpecialCharactersText } from '@ckeditor/ckeditor5-special-characters';
import { Style } from '@ckeditor/ckeditor5-style';
import { Table, TableToolbar, TableColumnResize, TableProperties, TableCellProperties } from '@ckeditor/ckeditor5-table';
import { TextTransformation } from '@ckeditor/ckeditor5-typing';
import { Undo } from '@ckeditor/ckeditor5-undo';
import { Font, FontColor, FontBackgroundColor } from '@ckeditor/ckeditor5-font';

// You can read more about extending the build with additional plugins in the "Installing plugins" guide.
// See https://ckeditor.com/docs/ckeditor5/latest/installation/plugins/installing-plugins.html for details.

class Editor extends ClassicEditor {
	public static override builtinPlugins = [
		Autoformat,
		BlockQuote,
		Bold,
		CloudServices,
		Essentials,
		GeneralHtmlSupport,
		Heading,
		HorizontalLine,
		Image,
		ImageCaption,
		ImageStyle,
		ImageToolbar,
		ImageUpload,
		Indent,
		Italic,
		Underline,
		Link,
		List,
		MediaEmbed,
		Paragraph,
		PasteFromOffice,
		RemoveFormat,
		SourceEditing,
		SpecialCharacters,
		SpecialCharactersText,
		Strikethrough,
		Style,
		Table,
		TableToolbar,
		TableColumnResize,
		TextTransformation,
		Undo,
		TableProperties,
		TableCellProperties,
		Font,
		FontColor,
		FontBackgroundColor
	];

	public static override defaultConfig: EditorConfig = {
		fontFamily: {
			options: [
				'default',
				'Arial, Helvetica, sans-serif',
				'Courier New, Courier, monospace',
				'Georgia, serif',
				'Lucida Sans Unicode, Lucida Grande, sans-serif',
				'Tahoma, Geneva, sans-serif',
				'Times New Roman, Times, serif',
				'Trebuchet MS, Helvetica, sans-serif',
				'Verdana, Geneva, sans-serif',
			],
		},
		toolbar: {
			items: [
				'undo',
				'redo',
				'|',
				'link',
				'|',
				'imageUpload',
				'insertTable',
				'horizontalLine',
				'specialCharacters',
				'|',
				'bold',
				'italic',
				'underline',
				'strikethrough',
				'fontColor',
				'fontBackgroundColor',
				'removeFormat',
				'sourceEditing',
				'|',
				'numberedList',
				'bulletedList',
				'outdent',
				'indent',
				'blockQuote',
				'|',
				'fontFamily',
				'fontSize',
				'|',
				'style',
				'|',
				'heading'
			],
			shouldNotGroupWhenFull: true
		},
		language: 'en',
		image: {
			toolbar: [
				'imageTextAlternative',
				'toggleImageCaption',
				'imageStyle:inline',
				'imageStyle:block',
				'imageStyle:side'
			],
			upload: {
				types: ['jpeg', 'png', 'gif']
			},
		},
		table: {
			contentToolbar: [
				'tableRow',
				'mergeTableCells',
				'tableCellProperties',
				'tableProperties'
			]
		},
		style: {
			definitions: [
				{
					name: 'Article category',
					element: 'p',
					classes: ['category']
				},
				{
					name: 'Info box',
					element: 'p',
					classes: ['info-box']
				},
				{
					name: 'Highlighted Text',
					element: 'span',
					classes: ['highlighted-text']
				},
				{
					name: 'Important Note',
					element: 'p',
					classes: ['important-note']
				},
				{
					name: 'Special Container',
					element: 'div', // Changed 'p' to 'div' to match the selector
					classes: ['special-container']
				},
			]
		}
	};
}

export default Editor;
