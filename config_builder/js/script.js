import { createApp, ref, onMounted, watch, nextTick } from 'vue'
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
            let configString = `
module.exports.config = ${JSON.stringify(config.value, null, 2)};

module.exports.fields = [
${fields.value.map(field => `    {
        source: "${field.source}",
        target: "${field.target}"${field.enablePreprocessor ? `,
        beforeConvert: ${field.preprocessor}` : ''}
    }`).join(',\n')}
];
            `.trim();

            if (enablePreprocessor.value) {
                configString += `\n\n${preprocessorEditor.getValue().trim()}`;
            }

            if (enablePostprocessor.value) {
                configString += `\n\n${postprocessorEditor.getValue().trim()}`;
            }

            // 移除最後的空行
            configString = configString.replace(/\n+$/, '');

            generatedConfigEditor.setValue(configString);
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
        watch([config, fields, enablePreprocessor, enablePostprocessor], updateGeneratedConfig, { deep: true })

        const downloadConfig = () => {
            const configContent = generatedConfigEditor.getValue();
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
            toggleFieldPreprocessor
        }
    }
})

app.use(i18n)
app.mount('#app')
