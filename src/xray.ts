import { execSync } from "child_process";
import { existsSync, readFileSync, writeFileSync } from "fs";

export interface Client {
  id: string;
  email: string;
  alterId: number;
}

export interface Inbound {
  listen: string | null;
  port: number | null;
  protocol: string;
  settings: {
    address: string | null;
    clients: Client[];
    disableInsecureEncryption: boolean;
  };
  streamSettings: {
    network: string;
    security: string;
    tcpSettings: {
      header: {
        type: string;
        request: {
          method: string;
          path: string[];
          headers: { [key: string]: string };
        };
        response: {
          version: string;
          status: string;
          reason: string;
          headers: { [key: string]: string };
        };
      };
      acceptProxyProtocol: boolean;
    };
  };
  sniffing: {
    enabled: boolean;
    destOverride: string[];
  };
  tag: string;
}

interface IConfig {
  inbounds: Inbound[];
}

export async function restartXray() {
  execSync(`service xray restart`);
}

export async function installLocalConfig() {
  const template = JSON.parse(readFileSync("./xray.json").toString()) as IConfig;
  template.inbounds.map((item) => {
    if (item.tag === "api") {
      item.port = Math.floor(Math.random() * 35536) + 30000;
    }
    return item;
  });
  if (!existsSync(process.env.XRAY_CONFIG_PATH)) {
    writeFileSync(process.env.XRAY_CONFIG_PATH, JSON.stringify(template));
  } else {
    const configContent = readFileSync(process.env.XRAY_CONFIG_PATH).toString();
    if (configContent === "{}") {
      writeFileSync(process.env.XRAY_CONFIG_PATH, JSON.stringify(template));
    }
  }
  await restartXray();
}

function loadXrayConfig() {
  if (!existsSync(process.env.XRAY_CONFIG_PATH)) {
    throw new Error("xray config file not found at " + process.env.XRAY_CONFIG_PATH);
  }
  const content = JSON.parse(readFileSync(process.env.XRAY_CONFIG_PATH).toString()) as IConfig;
  return content;
}

function loadInboundsList() {
  const { inbounds } = loadXrayConfig();
  return inbounds;
}

function loadDockerDemoPort() {
  const inbounds = loadInboundsList();
  const apiInbound = inbounds.find((item) => item.tag === "api");
  if (!apiInbound) {
    throw new Error("api inbound not found. please add the api inbound with 'api' tag");
  }
  return apiInbound.port;
}

export async function updateInbounds(inbounds: Inbound[]) {
  const config = loadXrayConfig();
  config.inbounds = config.inbounds.map((item) => {
    const newVersion = inbounds.find((record) => item.tag === record.tag);
    if (!newVersion) {
      return;
    }
    newVersion.settings.clients = item.settings.clients;
    return newVersion;
  });
  writeFileSync(process.env.XRAY_CONFIG_PATH, JSON.stringify(config));
  await restartXray();
  console.log("inbounds updated");
}

export async function addClient(inbound: string, client: Client) {
  const config = loadXrayConfig();
  config.inbounds = config.inbounds.map((item) => {
    if (item.tag === inbound) {
      item.settings.clients.push(client);
    }
    return item;
  });
  writeFileSync(process.env.XRAY_CONFIG_PATH, JSON.stringify(config));
  await restartXray();
  console.log("clients updated");
}

export async function removeClient(inbound: string, client: Client) {
  const config = loadXrayConfig();
  config.inbounds = config.inbounds.map((item) => {
    if (item.tag === inbound) {
      item.settings.clients = item.settings.clients.filter((record) => record.email === client.email && record.id === client.id);
    }
    return item;
  });
  writeFileSync(process.env.XRAY_CONFIG_PATH, JSON.stringify(config));
  await restartXray();
  console.log("clients updated");
}

export async function updateClients(records: { client: Client; inbound: string }[]) {
  const config = loadXrayConfig();
  config.inbounds = config.inbounds.map((item) => {
    item.settings.clients = records.filter((record) => record.inbound === item.tag).map((record) => record.client);
    return item;
  });
  writeFileSync(process.env.XRAY_CONFIG_PATH, JSON.stringify(config));
  await restartXray();
  console.log("clients updated");
}

export async function getTrafficStats() {
  const dockerDemoPort = loadDockerDemoPort();
  const { stat } = JSON.parse(execSync(`xray api statsquery --server=127.0.0.1:${dockerDemoPort} -pattern "user"`).toString()) as {
    stat: { name: string; value: string }[];
  };
  const result = stat.map((item) => {
    item.name = item.name.replace("user>>>", "").replace(">>>traffic>>>uplink", "").replace(">>>traffic>>>downlink", "");
    return item;
  });
  const clientStats: { name: string; traffic: number }[] = [];
  for (let i = 0; i < result.length; i++) {
    const client = clientStats.find((item) => item.name === result[i].name);
    if (client) {
      client.traffic += parseInt(result[i].value);
    } else {
      clientStats.push({ name: result[i].name, traffic: parseInt(result[i].value) });
    }
  }
  return clientStats;
}
