console.log("In order to setup section you need to get your projectId and projectUrl by registering an account on https://sections.geeks.solutions")

module.exports = [
    {
        name: 'choice',
        type: 'list',
        message: 'What version of sections would you like to install on your project:',
        choices: [
            { name: 'Nuxt version (with SSR support)', value: 'nuxt' },
            { name: 'Vue version', value: 'vue' },
        ],
    },
    {
        type: 'input',
        name: 'projectUrl',
        message: 'What is your project url:',
        validate: input => !!input,
        default: ''
    },
    {
        type: 'input',
        name: 'projectId',
        message: 'What is your project ID:',
        validate: input => !!input,
        default: ''
    },
    {
        type: 'confirm',
        name: 'addSectionsFiles',
        message: 'Add vue-sections configuration with first sections page',
        when: answers => answers.choice === 'vue',
        description: 'This will generate a ready to use sections page',
        default: false,
    },
    {
        type: 'confirm',
        name: 'addReadyToUseSectionTypes',
        message: 'Add 3 ready to use section types to your project',
        description: 'This will generate 3 ready to use section types',
        default: false,
    },
    {
        type: 'input',
        name: 'email',
        message: 'What is your email:',
        when: answers => answers.addReadyToUseSectionTypes === true,
        validate: input => !!input,
        default: ''
    },
    {
        type: 'password',
        name: 'password',
        message: 'What is your password:',
        when: answers => answers.addReadyToUseSectionTypes === true,
        validate: input => !!input,
        default: ''
    },
]