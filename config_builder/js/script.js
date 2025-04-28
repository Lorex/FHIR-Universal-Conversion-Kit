import { createApp, ref, onMounted, watch, nextTick, computed } from 'vue'
import i18n from './i18n.js'  // 導入 i18n 實例

const app = createApp({
    setup() {
        const config = ref({
            name: '',
            version: '0.0.1',
            fhirServerBaseUrl: '',
            action: 'upload',
            fhir_version: 'R4',
            validate: false
        })
        const fields = ref([])
        const enablePreprocessor = ref(false)
        const enablePostprocessor = ref(false)
        const generatedConfig = ref('')
        const fieldPreprocessors = ref({})
        const globalResourceTemplates = ref([])
        const newResourceType = ref('')
        const resourceTemplateEditors = ref({})

        let preprocessorEditor, postprocessorEditor, generatedConfigEditor

        const preprocessorTemplate = `
// Global data pre-processor
module.exports.beforeProcess = (data) => {
    // 在這裡編寫您的前處理邏輯
    // 例如：
    // // Combine names
    // data.fullName = \`\${data.lastName} \${data.firstName}\`;
    
    // // Add timestamp
    // data.timestamp = new Date().toISOString();
    
    // // Delete original lastName and firstName fields
    // delete data.lastName;
    // delete data.firstName;
    
    return data;
}
        `.trim()

        const postprocessorTemplate = `
// Global data post-processor
module.exports.afterProcess = (bundle) => {
    // 在這裡編寫您的後處理邏輯
    // 例如：
    // // Check if Organization resource already exists
    // const organizationEntry = bundle.entry.find(entry => entry.resource.resourceType === 'Organization');
    
    // if (!organizationEntry) {
    //     // If not, add Organization resource
    //     bundle.entry.unshift({
    //         fullUrl: \`\${config.fhirServerBaseUrl}/Organization/\${organizationId}\`,
    //         resource: globalResource.Organization,
    //         request: {
    //             method: 'PUT',
    //             url: \`Organization/\${organizationId}\`
    //         }
    //     });
    // }
    
    return bundle;
}
        `.trim()

        onMounted(() => {
            ace.require("ace/ext/language_tools");

            const editorConfig = {
                theme: "ace/theme/monokai",
                mode: "ace/mode/javascript",
                enableBasicAutocompletion: true,
                enableSnippets: true,
                enableLiveAutocompletion: true
            };

            preprocessorEditor = ace.edit("preprocessorEditor", editorConfig);
            preprocessorEditor.setValue(preprocessorTemplate);
            preprocessorEditor.clearSelection();
            preprocessorEditor.on('change', updateGeneratedConfig);

            postprocessorEditor = ace.edit("postprocessorEditor", editorConfig);
            postprocessorEditor.setValue(postprocessorTemplate);
            postprocessorEditor.clearSelection();
            postprocessorEditor.on('change', updateGeneratedConfig);

            generatedConfigEditor = ace.edit("generatedConfigEditor", {
                ...editorConfig,
                readOnly: true
            });

            // 添加自定義自動完成
            const customCompleter = {
                getCompletions: function(editor, session, pos, prefix, callback) {
                    const completions = [
                        { value: 'module.exports', score: 1000, meta: 'keyword' },
                        { value: 'config', score: 900, meta: 'object' },
                        { value: 'fields', score: 900, meta: 'array' },
                        { value: 'beforeProcess', score: 800, meta: 'function' },
                        { value: 'afterProcess', score: 800, meta: 'function' },
                        { value: 'data', score: 700, meta: 'parameter' },
                        { value: 'bundle', score: 700, meta: 'parameter' },
                        { value: 'resourceType', score: 600, meta: 'property' },
                        { value: 'Patient', score: 500, meta: 'resource' },
                        { value: 'Observation', score: 500, meta: 'resource' },
                        { value: 'Organization', score: 500, meta: 'resource' },
                        { value: 'Encounter', score: 500, meta: 'resource' },
                    ];
                    callback(null, completions);
                }
            };

            [preprocessorEditor, postprocessorEditor].forEach(editor => {
                editor.completers.push(customCompleter);
            });

            updateGeneratedConfig();
        })

        const addField = () => {
            fields.value.push({ 
                source: '', 
                target: '', 
                showPreprocessor: false,
                enablePreprocessor: false,
                preprocessor: `// Field preprocessor
(data) => {
    // Your preprocessing logic here
    return data;
}`
            })
        }

        const removeField = (index) => {
            fields.value.splice(index, 1)
            delete fieldPreprocessors.value[index]
        }

        const changeLanguage = (lang) => {
            i18n.global.locale.value = lang
        }

        const toggleFieldPreprocessor = (index) => {
            fields.value[index].showPreprocessor = !fields.value[index].showPreprocessor
            if (fields.value[index].showPreprocessor) {
                nextTick(() => {
                    // 每次展開時都重新創建編輯器
                    if (fieldPreprocessors.value[index]) {
                        fieldPreprocessors.value[index].destroy()
                        fieldPreprocessors.value[index].container.remove()
                    }
                    const editorElement = document.createElement('div')
                    editorElement.id = 'fieldPreprocessor' + index
                    editorElement.style.height = '200px'
                    document.getElementById('fieldPreprocessor' + index).appendChild(editorElement)
                    
                    fieldPreprocessors.value[index] = ace.edit(editorElement, {
                        theme: "ace/theme/monokai",
                        mode: "ace/mode/javascript",
                        enableBasicAutocompletion: true,
                        enableSnippets: true,
                        enableLiveAutocompletion: true
                    })
                    fieldPreprocessors.value[index].setValue(fields.value[index].preprocessor)
                    fieldPreprocessors.value[index].clearSelection()
                    fieldPreprocessors.value[index].on('change', () => {
                        fields.value[index].preprocessor = fieldPreprocessors.value[index].getValue()
                        updateGeneratedConfig()
                    })
                })
            }
        }

        const updateGeneratedConfig = () => {
            let imports = new Set()
            let configString = ''

            // 檢查並收集所有編輯器中的 import 和 require 語句
            const checkForImports = (editorValue) => {
                const lines = editorValue.split('\n')
                for (const line of lines) {
                    if (line.trim().startsWith('import') || 
                        (line.trim().startsWith('const') && line.includes('require(')) ||
                        line.trim().startsWith('let') && line.includes('require(') ||
                        line.trim().startsWith('var') && line.includes('require(')) {
                        imports.add(line.trim())
                    }
                }
            }

            // 移除編輯器內容中的 import 和 require 語句
            const removeImports = (editorValue) => {
                return editorValue.split('\n')
                    .filter(line => 
                        !line.trim().startsWith('import') && 
                        !(line.trim().startsWith('const') && line.includes('require(')) &&
                        !(line.trim().startsWith('let') && line.includes('require(')) &&
                        !(line.trim().startsWith('var') && line.includes('require('))
                    )
                    .join('\n')
            }

            // 檢查所有可能包 import 或 require 地方
            checkForImports(preprocessorEditor.getValue())
            checkForImports(postprocessorEditor.getValue())
            Object.values(resourceTemplateEditors.value).forEach(editor => checkForImports(editor.getValue()))
            Object.values(fieldPreprocessors.value).forEach(editor => checkForImports(editor.getValue()))

            // 添加收集到的 import 和 require 語句到配置文件的開頭
            if (imports.size > 0) {
                configString += Array.from(imports).join('\n') + '\n\n'
            }

            // 添加其他配置內容
            configString += `
module.exports.config = ${JSON.stringify(config.value, null, 2)};

module.exports.globalResource = {
${globalResourceTemplates.value.map(template => `    ${template.resourceType}: ${removeImports(template.template)}`).join(',\n')}
};

module.exports.fields = [
${fields.value.map(field => `    {
        source: "${field.source}",
        target: "${field.target}"${field.enablePreprocessor ? `,
        beforeConvert: ${removeImports(field.preprocessor)}` : ''}
    }`).join(',\n')}
];
            `.trim();

            if (enablePreprocessor.value) {
                configString += `\n\n${removeImports(preprocessorEditor.getValue()).trim()}`;
            }

            if (enablePostprocessor.value) {
                configString += `\n\n${removeImports(postprocessorEditor.getValue()).trim()}`;
            }

            // 使用全局的 js_beautify 函數
            const beautifiedConfig = js_beautify(configString, {
                indent_size: 2,
                space_in_empty_paren: true
            });

            generatedConfigEditor.setValue(beautifiedConfig);
            generatedConfigEditor.clearSelection();
        }

        const generateRandomName = () => {
            const adjectives = ['Awesome', 'Fantastic', 'Groovy', 'Jazzy', 'Quirky', 'Zany', 'Wacky', 'Funky', 'Spiffy', 'Snazzy'];
            const nouns = ['Unicorn', 'Ninja', 'Wizard', 'Pirate', 'Dinosaur', 'Robot', 'Superhero', 'Rockstar', 'Jedi', 'Yeti'];
            const verbs = ['Transforming', 'Juggling', 'Hacking', 'Surfing', 'Teleporting', 'Moonwalking', 'Karate-chopping', 'Disco-dancing', 'Levitating', 'Yodeling'];
            
            const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
            const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
            const randomVerb = verbs[Math.floor(Math.random() * verbs.length)];
            
            config.value.name = `${randomAdjective}${randomNoun}${randomVerb}`;
        }

        // 監視所有可能影響生成配置的數據
        watch([config, fields, enablePreprocessor, enablePostprocessor, globalResourceTemplates], updateGeneratedConfig, { deep: true })

        const downloadConfig = () => {
            const configContent = generatedConfigEditor.getValue(); // 這裡已經是美化後的內容
            const blob = new Blob([configContent], { type: 'text/javascript' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${config.value.name || 'config'}.js`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }

        const addResourceTemplate = () => {
            globalResourceTemplates.value.push({
                resourceType: '',
                template: '{\n    // Add your FHIR resource template here\n}',
                showEditor: false
            })
        }

        const removeResourceTemplate = (index) => {
            globalResourceTemplates.value.splice(index, 1)
            if (resourceTemplateEditors.value[index]) {
                resourceTemplateEditors.value[index].destroy()
                delete resourceTemplateEditors.value[index]
            }
        }

        const initResourceTemplateEditor = (index) => {
            const editorElement = document.getElementById(`resourceTemplateEditor${index}`)
            if (editorElement) {
                resourceTemplateEditors.value[index] = ace.edit(editorElement, {
                    theme: "ace/theme/monokai",
                    mode: "ace/mode/javascript",
                    enableBasicAutocompletion: true,
                    enableSnippets: true,
                    enableLiveAutocompletion: true
                })
                resourceTemplateEditors.value[index].setValue(globalResourceTemplates.value[index].template)
                resourceTemplateEditors.value[index].clearSelection()
                resourceTemplateEditors.value[index].on('change', () => {
                    globalResourceTemplates.value[index].template = resourceTemplateEditors.value[index].getValue()
                    updateGeneratedConfig()
                })
            }
        }

        const toggleResourceTemplateEditor = (index) => {
            globalResourceTemplates.value[index].showEditor = !globalResourceTemplates.value[index].showEditor
            if (globalResourceTemplates.value[index].showEditor) {
                nextTick(() => {
                    initResourceTemplateEditor(index)
                })
            }
        }

        const fhirSchema = ref({})
        const loadingSchema = ref(false)
        const availableResources = ref([])

        const loadFhirSchema = async (version) => {
            loadingSchema.value = true
            try {
                const response = await fetch(`/src/fhir_packages/${version}/fhir.schema.json`)
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`)
                }
                const schema = await response.json()
                console.log('Loaded FHIR schema:', schema)
                fhirSchema.value = schema
                
                // 從 discriminator.mapping 中擷取支援的 resource types
                if (schema.discriminator && schema.discriminator.mapping) {
                    availableResources.value = Object.keys(schema.discriminator.mapping)
                } else {
                    console.warn('discriminator.mapping not found in schema')
                    availableResources.value = []
                }
            } catch (error) {
                console.error("Could not load FHIR schema:", error)
                availableResources.value = []
            } finally {
                loadingSchema.value = false
            }
        }

        // 當 FHIR 版本改變時加載對應的 schema
        watch(() => config.value.fhir_version, (newVersion) => {
            loadFhirSchema(newVersion)
        })

        // 初始加載 schema
        onMounted(() => {
            loadFhirSchema(config.value.fhir_version)
        })

        // 修改 watch 函數以使用新的 availableResources
        watch(() => config.value.fhir_version, (newVersion) => {
            globalResourceTemplates.value.forEach((template) => {
                if (!availableResources.value.includes(template.resourceType)) {
                    template.resourceType = ''
                }
            })
        })

        return {
            config,
            fields,
            enablePreprocessor,
            enablePostprocessor,
            generatedConfig,
            addField,
            removeField,
            changeLanguage,
            generateRandomName,
            downloadConfig,
            toggleFieldPreprocessor,
            globalResourceTemplates,
            newResourceType,
            addResourceTemplate,
            removeResourceTemplate,
            toggleResourceTemplateEditor,
            availableResources,
            loadingSchema
        }
    }
})

app.use(i18n)
app.mount('#app')
