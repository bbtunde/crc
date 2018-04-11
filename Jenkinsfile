@Library('jenkins')
import jumia.mds.util.Jenkins

def tools = new jumia.mds.util.Jenkins()

node {
    stage('Build') {
        if (action in ["BuildAndDeployStaging"]) {
            echo 'Checking out lastest code...'
            tools.checkoutRepository('development', 'paga', '2ff574dc-6f69-460f-bbe5-37d02eeed4ba')

            echo 'Building...'
            buildTag = tools.getCommitHash('paga')
            dir('paga') {
                sh 'npm install'
                sh 'docker build --no-cache -t paga . -f Dockerfile'
            }
            tools.pushImageToECR('paga', buildTag)
        }
    }

    stage('DeployStagingOne') {
        if (action in ["BuildAndDeployStaging", "DeployStagingOne"]) {
            echo 'Checking out lastest code...'
            tools.checkoutRepository('development', 'paga', '2ff574dc-6f69-460f-bbe5-37d02eeed4ba')

            echo 'Checking out configurations...'
            tools.checkoutRepository('staging', 'configsone', '3ac58edd-bba3-47b2-9f7b-87eafd5c458c')

            echo 'Checking out charts...'
            tools.checkoutRepository('master', 'charts', '11c90820-6b3c-4bc5-aab3-67f8b550f30b')

            echo 'Load configurations...'
            sh 'cp -f configsone/paga.json charts/nodejs/config.json'

            echo 'Deploying...'
            buildTag = tools.getBuild('paga')
            tools.kubernetesDeploy('one', 'staging', 'paga', 'nodejs', buildTag)

            echo 'Cleaning...'
            sh 'rm -f charts/nodejs/config.json'
        }
    }

    stage('DeployProductionOne') {
        if (action in ["DeployProductionOne"]) {
            echo 'Checking out lastest code...'
            tools.checkoutRepository('development', 'paga', '2ff574dc-6f69-460f-bbe5-37d02eeed4ba')

            echo 'Checking out configurations...'
            tools.checkoutRepository('production', 'configsone', '3ac58edd-bba3-47b2-9f7b-87eafd5c458c')

            echo 'Checking out charts...'
            tools.checkoutRepository('master', 'charts', '11c90820-6b3c-4bc5-aab3-67f8b550f30b')

            echo 'Load configurations...'
            sh 'cp -f configsone/paga.json charts/nodejs/config.json'

            echo 'Deploying...'
            buildTag = tools.getBuild('paga')
            tools.kubernetesDeploy('one', 'production', 'paga', 'nodejs', buildTag)

            echo 'Cleaning...'
            sh 'rm -f charts/nodejs/config.json'
        }
    }
}
