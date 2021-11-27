const axios = require('axios').default

//5ab39031-4bb3-41b6-a1fc-65fd5bba11ff

const compiler = async (sourceCode, inputs, codeType) => {
    lang = null
    ext = null
    if (codeType === '1') {
        lang = 'c'
        ext = '.c'
    } else if (codeType === '2') {
        lang = 'cpp'
        ext = '.cpp'
    } else if (codeType === '3') {
        lang = 'java'
        ext = '.java'
    } else if (codeType == '4') {
        lang = 'python'
        ext = '.py'
    }

    let data = await axios({
        method: 'post',
        url: `https://glot.io/api/run/${lang}/latest`,
        data: {
            stdin: inputs,
            files: [
                {
                    name: `Main${ext}`,
                    content: sourceCode,
                },
            ],
        },
        headers: {
            Authorization: 'Token 5ab39031-4bb3-41b6-a1fc-65fd5bba11ff',
        },
    })
    return data.data
}

module.exports = compiler
