#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:5.0 AS base
RUN apt-get update -yq \
    && apt-get install curl gnupg -yq \
    && curl -sL https://deb.nodesource.com/setup_10.x | bash \
    && apt-get install nodejs -yq \
	&& npm install axios crypto-js js-sha256
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:5.0 AS build
RUN apt-get update -yq \
    && apt-get install curl gnupg -yq \
    && curl -sL https://deb.nodesource.com/setup_10.x | bash \
    && apt-get install nodejs -yq \
	&& npm install axios crypto-js js-sha256
WORKDIR /src
COPY ["SimpleExpenditureTracker.csproj", "."]
RUN dotnet restore "./SimpleExpenditureTracker.csproj"
COPY . .
WORKDIR "/src/."
RUN dotnet build "SimpleExpenditureTracker.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "SimpleExpenditureTracker.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "SimpleExpenditureTracker.dll"]