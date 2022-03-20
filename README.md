# Currency Converter

## Getting Started

1. `git clone https://github.com/schneidermichael/currency-converter-soap.git`
2. `cd currency-converter-soap`
3. `mvn package`
4. `mvn tomee:run`
5. Open a browser and go to https://localhost:4321/currency-converter-1.0.0/services (Username/Password see Credentials)
6. To stop the service type `exit` in your terminal

## Endpoints

### CXF - Service List
https://localhost:4321/currency-converter-1.0.0/services

### HTTP (Redirect to https)
http://localhost:8080/currency-converter-1.0.0/services/CurrencyConverterService

### HTTPS
https://localhost:4321/currency-converter-1.0.0/services/CurrencyConverterService

### WSDL
https://localhost:4321/currency-converter-1.0.0/services/CurrencyConverterService?wsdl

### Credentials

* Username: group1 
* Password: group1

## Docker

1. `docker build -t currency-converter .`
2. `docker run --name currency-converter -d -p 4321:4321 -p 8080:8080 currency-converter`

## Testing

### Client (written in Node.js)

works only when the service is running (see Getting Started or Docker)

1. Go to `cd currency-converter-soap/src/main/client`
2. `npm install`
3. node client.js

### SoapUI

Import Workspace from `currency-converter-soap/src/main/resources/soapUI/currency-converter-soapui-project.xml` 

## Reference Documentation

* [Apache CXF](https://cxf.apache.org/)
* [Apache TomEE 8.0.9 Plus](https://tomee.apache.org/)
* [Apache Maven](https://maven.apache.org/)
* [Node.js](https://nodejs.org/en/)
* [Docker](https://www.docker.com/)
* [SoapUI](https://www.soapui.org/)

## Deploy to Azure

### Build and run locally
see Docker

### Push image to Azure registry
```shell
RESOURCE_GROUP="container-deployment-rg"
LOCATION="westeurope"
REGISTRY_NAME="caf3babescontainerregistry"
REGISTRY_USER="00000000-0000-0000-0000-000000000000"
IMAGE_NAME="currency-converter"


az group delete --name "${RESOURCE_GROUP}" --yes

az group create --name "${RESOURCE_GROUP}" --location "${LOCATION}"
az acr create --resource-group "${RESOURCE_GROUP}" --name "${REGISTRY_NAME}" --sku Basic
az acr login --name "${REGISTRY_NAME}"

ACR_LOGIN_SERVER=$(az acr show --name "${REGISTRY_NAME}" --query loginServer --output tsv)
REGISTRY_TOKEN=$(az acr login --name $REGISTRY_NAME --expose-token --out tsv 2>/dev/null | awk -F '\t' '{print $1}')
docker login $ACR_LOGIN_SERVER --username 00000000-0000-0000-0000-000000000000 --password "${REGISTRY_TOKEN}"
docker tag currency-converter ${ACR_LOGIN_SERVER}/${IMAGE_NAME}:v1
docker push ${ACR_LOGIN_SERVER}/${IMAGE_NAME}:v1

az acr repository list --name ${REGISTRY_NAME} --output table

```

### Create Container from image

```shell
RESOURCE_GROUP="container-deployment-rg"
APP_NAME="currency-converter"
az container create --resource-group ${RESOURCE_GROUP} --name ${APP_NAME} \
  --image ${ACR_LOGIN_SERVER}/${IMAGE_NAME}:v1 --cpu 1 --memory 1 \
  --registry-username "${REGISTRY_USER}" --registry-password "${REGISTRY_TOKEN}" \
  --registry-login-server ${ACR_LOGIN_SERVER} --dns-name-label ${APP_NAME} --ports 8080 4321
  
az container show --resource-group ${RESOURCE_GROUP} --name ${APP_NAME} --query instanceView.state
az container show --resource-group ${RESOURCE_GROUP} --name ${APP_NAME} --query ipAddress.fqdn
az container logs --resource-group ${RESOURCE_GROUP} --name ${APP_NAME}

```

### Clean up
```shell
az group delete --name ${RESOURCE_GROUP}
```