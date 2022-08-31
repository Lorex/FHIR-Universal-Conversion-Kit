docker build -t ubuntu_fuck . --no-cache

docker run -d --name FHIR_universal_conversion_kit -p 1337:1337 --workdir /home/FHIR-Universal-Conversion-Kit/ ubuntu_fuck