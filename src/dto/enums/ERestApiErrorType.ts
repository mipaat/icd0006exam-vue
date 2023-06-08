export enum ERestApiErrorType {
    UserAlreadyRegistered = "UserAlreadyRegistered",
    InvalidLoginCredentials = "InvalidLoginCredentials",
    InvalidRegistrationData = "InvalidRegistrationData",
    UserNotFound = "UserNotFound",

    InvalidTokenExpirationRequested = "InvalidTokenExpirationRequested",
    InvalidJwt = "InvalidJwt",
    InvalidRefreshToken = "InvalidRefreshToken",
}