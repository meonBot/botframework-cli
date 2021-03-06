import {readTextFile} from './../../src/utils/textfilereader'
const expect = require('chai').expect;   
const assert = require('chai').assert
const fileHelper = require('./../../src/utils/filehelper')
const luObject = require('./../../src/parser/lu/lu')
const luOptions = require('./../../src/parser/lu/luOptions')
const path = require('path')

describe('utils/filehelper test', () => {
    it('File helper correctly  builds a luObject list from a file', async function(){
            let expected = []
            let pathToFile = path.resolve(path.join(__dirname, './../fixtures/file.lu'))
            let content = await readTextFile(pathToFile)
            expected.push(new luObject(content, new luOptions(pathToFile)))
            let luObjArray = await fileHelper.getLuObjects('', pathToFile)
            expect(luObjArray).to.deep.equal(expected)
    })

    it('File helper correctly  builds a luObject list from stdin', async function(){
            let content = `> Definition for greeting intent
            # Greeting
            - Hi
            - Hello
            > users might say these
            - Good morning 
            - Good evening`
            let luObjArray = await fileHelper.getLuObjects(content, '')
            let expected = []
            expected.push(new luObject(content, new luOptions('stdin')))
            expect(luObjArray).to.deep.equal(expected)
    })

    it('File helper correctly build cross train config object', function () {
        const rawConfigObject = {
            "main": {
                "rootDialog": true,
                "triggers": {
                    "dia1_trigger": ["dia1", "dia2"]
                }
            },
            "dia2": {
                "triggers": {
                    "dia3_trigger": "",
                    "": "dia4"
                }
            },
            "main.fr-fr": {
                "rootDialog": true,
                "triggers": {
                    "dia1_trigger": "dia1.fr-fr"
                }
            }
        }

        let configObject = fileHelper.getConfigObject(rawConfigObject, '_Interruption', true)
        assert.equal(configObject.rootIds[0].includes('main'), true)
        assert.equal(configObject.rootIds[1].includes('main.fr-fr'), true)

        let triggerRuleKeys = [...Object.keys(configObject.triggerRules)]
        assert.equal(triggerRuleKeys[0].includes('main'), true)
        assert.equal(triggerRuleKeys[1].includes('dia2'), true)
        assert.equal(triggerRuleKeys[2].includes('main.fr-fr'), true)

        let triggerRuleValues = [...Object.values(configObject.triggerRules)]
        assert.equal(triggerRuleValues[0]['dia1_trigger'][0].includes('dia1'), true)
        assert.equal(triggerRuleValues[0]['dia1_trigger'][1].includes('dia2'), true)
        assert.equal(triggerRuleValues[1]['dia3_trigger'][0], '')
        assert.equal(triggerRuleValues[1][''][0].includes('dia4'), true)
        assert.equal(triggerRuleValues[2]['dia1_trigger'][0].includes('dia1.fr-fr'), true)

        assert.equal(configObject.intentName, '_Interruption')

        assert.equal(configObject.verbose, true)

        configObject = fileHelper.getConfigObject(rawConfigObject, '_Interruption', true)
        assert.equal(configObject.rootIds[0], 'main')
        assert.equal(configObject.rootIds[1], 'main.fr-fr')

        triggerRuleKeys = [...Object.keys(configObject.triggerRules)]
        assert.equal(triggerRuleKeys[0], 'main')
        assert.equal(triggerRuleKeys[1], 'dia2')
        assert.equal(triggerRuleKeys[2], 'main.fr-fr')

        triggerRuleValues = [...Object.values(configObject.triggerRules)]
        assert.equal(triggerRuleValues[0]['dia1_trigger'][0], 'dia1')
        assert.equal(triggerRuleValues[0]['dia1_trigger'][1], 'dia2')
        assert.equal(triggerRuleValues[1]['dia3_trigger'][0], '')
        assert.equal(triggerRuleValues[1][''][0], 'dia4')
        assert.equal(triggerRuleValues[2]['dia1_trigger'][0], 'dia1.fr-fr')

        assert.equal(configObject.intentName, '_Interruption')

        assert.equal(configObject.verbose, true)
    })
})