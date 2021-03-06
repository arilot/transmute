const run = require('../runner');
const logger = require('../../logger');
const TRANSMUTE_KUBE_VERSION = process.env.TRANSMUTE_KUBE_VERSION || 'v1.9.0';
const MINIKUBE_CPU = process.env.MINIKUBE_CPU || '4';
const MINIKUBE_MEMORY = process.env.MINIKUBE_MEMORY || '4096';
const MINIKUBE_DISK = process.env.MINIKUBE_DISK || '100g';
const MINIKUBE_PROFILE = process.env.MINIKUBE_PROFILE || 'transmute-k8s';
const MINIKUBE_DRIVERS = ['virtualbox', 'kvm', 'kvm2', 'none'];

module.exports.minikube = (dryrun, clusterName, minikubeDriver) => {
  let minikube_param =
    ' -e kubernetes_version=' +
    TRANSMUTE_KUBE_VERSION +
    ' -e minikube_disk_size=' +
    MINIKUBE_DISK +
    ' -e minikube_cpus=' +
    MINIKUBE_CPU +
    ' -e minikube_memory=' +
    MINIKUBE_MEMORY +
    ' -e minikube_profile=' + MINIKUBE_PROFILE;

  let prov_cmd =
    'ansible-playbook --diff -l "localhost" ' +
    __dirname +
    '/../../../components/ansible/provision-minikube.yml';

  if (MINIKUBE_DRIVERS.indexOf(minikubeDriver) == -1) {
    minikubeDriver = 'none';
  }

  if (minikubeDriver == 'none') {
    logger.log({
      level: 'info',
      message: `VMDriver=None requires minikube to run as root!`,
    });
  }

  prov_cmd = prov_cmd + ' -e minikube_vm_driver=' + minikubeDriver;

  prov_cmd = prov_cmd + minikube_param;
  if (dryrun === 'true') {
    console.info('<--dry run-->');
    prov_cmd = prov_cmd + ' --check';
  }
  run.shellExec(prov_cmd);
};

module.exports.aks = (dryrun,
                      myResourceGroup,
                      myAKSCluster,
                      myNodeCount,
                      myNodeSize,
                      GenSSHKeys,) => {
  let prov_cmd_asible =
    'ansible-playbook --diff -l "localhost" ' +
    __dirname +
    '/../../../components/ansible/provision-azure.yml';

  let gensshkeys_opt = '';
  if (GenSSHKeys) {
    gensshkeys_opt = '"--generate-ssh-keys"';
  }
  if (myAKSCluster == undefined) {
    throw 'You need to define a clustername';
  } else {
    var akscluster_opt = '"--name ' + myAKSCluster + '"';
  }
  if (myNodeCount == undefined) {
    throw 'You need to define a number of nodes';
  } else {
    var nodes_opt = '"--node-count ' + myNodeCount + '"';
  }
  if (myNodeSize == undefined) {
    console.warn('no size given using default');
    var nodesize_opt = '';
  } else {
    var nodesize_opt = '"--node-vm-size ' + myNodeSize + '"';
  }
  if (myResourceGroup == undefined) {
    throw 'You need to define a group';
  } else {
    var group_opt = '"--resource-group ' + myResourceGroup + '"';
  }

  let aksParams =
    ' -e dryrun=' +
    dryrun +
    ' -e group_opt=' +
    group_opt +
    ' -e akscluster_opt=' +
    akscluster_opt +
    ' -e nodes_opt=' +
    nodes_opt +
    ' -e nodesize_opt=' +
    nodesize_opt +
    ' -e gensshkeys_opt=' +
    gensshkeys_opt;

  let prov_cmd_azure = prov_cmd_asible + aksParams;
  if (dryrun === 'true') {
    console.info('<--dry run-->');
    prov_cmd_azure = prov_cmd_azure + ' --check';
  }
  run.shellExec(prov_cmd_azure);
};

module.exports.aws = (dryrun, clusterName, aws_region, aws_key, aws_secret) => {
  let prov_cmd = 'ansible-playbook --diff -l "localhost" ' +
    __dirname +
    '/../../../components/ansible/provision-aws.yml -e ' +
    clusterName;
  let awsParams = ' -e clusterName=' +
    clusterName +
    ' -e aws_region=' +
    aws_region +
    ' -e aws_key=' +
    aws_key +
    ' -e aws_secret=' +
    aws_secret;
  prov_cmd = prov_cmd + awsParams;
  if (dryrun == 'true') {
    console.info('<--dry run-->');
    prov_cmd = prov_cmd + ' --check';
  }
  run.shellExec(prov_cmd);
};
