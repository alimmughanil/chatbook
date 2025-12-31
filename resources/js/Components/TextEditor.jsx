import React, { useEffect, useRef } from "react"
import SunEditor from "suneditor-react"
import axios from "axios"
import "suneditor/dist/css/suneditor.min.css"

const TextEditor = (props) => {
	const { setData, data, column = "description", editorRef = null, showInline = false, addButtonList=[], saveModel= '', height="400px", minHeight="28rem" } = props
	const editor = editorRef ? editorRef : useRef()
	const getSunEditorInstance = (sunEditor) => {
		editor.current = sunEditor
	}

	const handleChange = (e) => {
		setData((state) => ({ ...state, [column]: e }))
	}
	const handleImageUploadBefore = (files, info, core) => {
		const formData = new FormData()
    formData.append("model", saveModel)
		formData.append("image", files[0])
		const img = document.createElement("img")

		axios.post("/upload/image", formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			})
			.then((res) => {
				img.src = res.data.image
				editor.current.insertHTML(img)
				editor.current.core.closeLoading()
			})
			.catch((error) => {
				const fileReader = new FileReader()
				let baseString
				fileReader.onloadend = function () {
					baseString = fileReader.result
					img.src = baseString
					editor.current.insertHTML(img)
					editor.current.core.closeLoading()
				}
				fileReader.readAsDataURL(files[0])
			})
	}

  const handleSyncImageSize = (editorContent) => {
		const images = editorContent.querySelectorAll('img[data-size]');
		images.forEach((img) => {
      const imageContainer = img.parentElement?.parentElement;

      if (imageContainer) {
        const dataSize = img.getAttribute('data-size');
        if (dataSize) {
          const [width, height] = dataSize.split(',').map((size) => size.trim());
          if (width) {
            imageContainer.style.width = width;
          }
          if (height) {
            imageContainer.style.height = height;
          }
        }
      }
		});
		handleChange(editorContent.innerHTML);
	}


  useEffect(() => {
    if (editor?.current) {
      const editorInstance = editor?.current;
      const editorContent = editorInstance.getContext().element.wysiwyg;

      const domparser = new DOMParser();
      const parsed = domparser.parseFromString(data[column], 'text/html');
      editorContent.innerHTML = parsed.body.innerHTML;

			handleSyncImageSize(editorContent);
      const handleMutationObserver = (mutationsList) => {
        mutationsList.forEach((mutation) => {
          if (mutation.type === 'attributes' && mutation.target.tagName === 'IMG') {
						handleSyncImageSize(editorContent);
					}
        });
      };

      const observer = new MutationObserver(handleMutationObserver);
      observer.observe(editorContent, {
        childList: true,
        attributes: true,
        subtree: true,
      });


      return () => {
        observer.disconnect();
      };
    }
  }, []);

  let disableButtonList = [
			"table",
			"link",
			"image",
			"video",
			"audio",
			"imageGallery",
			"codeView",
			"preview",
			"print",
			"save",
			"template"
  ]

	return (
		<div>
			<SunEditor
				height={height}
				onChange={handleChange}
				showInline={showInline}
				onImageUploadBefore={handleImageUploadBefore}
				getSunEditorInstance={getSunEditorInstance}
				setOptions={{
					iframe:false,
					textTags: {
						bold: "b",
						underline: "u",
						italic: "i",
						strike: "s",
					},
					mode: "classic",
					stickyToolbar: 0,
					rtl: false,
					minHeight: {minHeight},
					fontSizeUnit:"px",
					font: ["Arial", "tahoma", "Courier New,Courier"],
					fontSize: [8, 10, 14, 18, 24, 36],
					formats: ["p", "blockquote", "h1", "h2", "h3"],
					colorList: [
						["#ff0000", "#ff5e00", "#ffe400", "#abf200"],
						["#00d8ff", "#0055ff", "#6600ff", "#ff00dd"],
					],
					imageUploadSizeLimit: 1024 * 1024,
					imageMultipleFile: true,
					imageAccept: "image/*",
					imageFileInput: true,

					videoFileInput: false,
					tabDisable: false,
					lineHeights: [
						{
							text: "Single",
							value: 1,
						},
						{
							text: "Double",
							value: 2,
						},
					],
					paragraphStyles: [
						"spaced",
						{
							name: "Box",
							class: "__se__customClass",
						},
					],
					textStyles: [
						"translucent",
						{
							name: "Emphasis",
							style: "-webkit-text-emphasis: filled;",
							tag: "span",
						},
					],
					buttonList: [
						[
							"undo",
							"redo",
							"font",
							"fontSize",
							"formatBlock",
							"paragraphStyle",
							"blockquote",
							"bold",
							"underline",
							"italic",
							"strike",
							"subscript",
							"superscript",
							"fontColor",
							"hiliteColor",
							"textStyle",
							"removeFormat",
							"outdent",
							"indent",
							"align",
							"list",
							"horizontalRule",
							"lineHeight",
							...addButtonList,
              // ...disableButtonList,
							"fullScreen",
							"showBlocks",
						],
					],
				}}
			/>
		</div>
	)
}
export default TextEditor
