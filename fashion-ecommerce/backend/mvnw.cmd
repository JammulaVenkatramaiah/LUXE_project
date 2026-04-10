@REM ----------------------------------------------------------------------------
@REM Licensed to the Apache Software Foundation (ASF) under one
@REM or more contributor license agreements.  See the NOTICE file
@REM distributed with this work for additional information
@REM regarding copyright ownership.  The ASF licenses this file
@REM to you under the Apache License, Version 2.0 (the
@REM "License"); you may not use this file except in compliance
@REM with the License.  You may obtain a copy of the License at
@REM
@REM    http://www.apache.org/licenses/LICENSE-2.0
@REM
@REM Unless required by applicable law or agreed to in writing,
@REM software distributed under the License is distributed on an
@REM "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
@REM KIND, either express or implied.  See the License for the
@REM specific language governing permissions and limitations
@REM under the License.
@REM ----------------------------------------------------------------------------

@REM ----------------------------------------------------------------------------
@REM Apache Maven Wrapper startup script for Windows, version 3.3.2
@REM
@REM Required ENV vars:
@REM JAVA_HOME - location of a JDK home dir
@REM
@REM Optional ENV vars
@REM MAVEN_BATCH_ECHO - set to 'on' to enable the echoing of the batch commands
@REM MAVEN_BATCH_PAUSE - set to 'on' to wait for a key stroke before ending
@REM MAVEN_OPTS      - parameters passed to the Java VM when running Maven
@REM                   e.g. to debug Maven itself, use
@REM set MAVEN_OPTS=-Xdebug -Xrunjdwp:transport=dt_socket,server=y,suspend=y,address=8000
@REM ----------------------------------------------------------------------------

@echo off
@setlocal

set "DIRNAME=%~dp0"
if "%DIRNAME%" == "" set "DIRNAME=."
set "APP_BASE_NAME=%~n0"
set "APP_HOME=%DIRNAME%"

@REM Resolve any "." and ".." in APP_HOME to make it shorter.
for %%i in ("%APP_HOME%") do set "APP_HOME=%%~fi"

@REM Execute a command and set the result to a variable
for /f "usebackq tokens=*" %%i in (`where java 2^>nul`) do (
    set "JAVA_EXE=%%i"
    goto :found_java
)

:found_java
if not defined JAVA_EXE (
    echo.
    echo Error: JAVA_HOME is not defined correctly.
    echo   We cannot execute %JAVA_EXE%
    echo.
    exit /b 1
)

set "WRAPPER_JAR=%APP_HOME%\.mvn\wrapper\maven-wrapper.jar"
set "WRAPPER_MAIN=org.apache.maven.wrapper.MavenWrapperMain"

@REM Find the wrapper jar
if not exist "%WRAPPER_JAR%" (
    echo.
    echo Error: Could not find maven-wrapper.jar at %WRAPPER_JAR%
    echo Please make sure the wrapper was correctly installed.
    echo.
    exit /b 1
)

"%JAVA_EXE%" %MAVEN_OPTS% -classpath "%WRAPPER_JAR%" %WRAPPER_MAIN% %*
if ERRORLEVEL 1 exit /b 1
