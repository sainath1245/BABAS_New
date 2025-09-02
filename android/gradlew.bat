@REM @rem
@REM @rem Copyright 2015 the original author or authors.
@REM @rem
@REM @rem Licensed under the Apache License, Version 2.0 (the "License");
@REM @rem you may not use this file except in compliance with the License.
@REM @rem You may obtain a copy of the License at
@REM @rem
@REM @rem      https://www.apache.org/licenses/LICENSE-2.0
@REM @rem
@REM @rem Unless required by applicable law or agreed to in writing, software
@REM @rem distributed under the License is distributed on an "AS IS" BASIS,
@REM @rem WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
@REM @rem See the License for the specific language governing permissions and
@REM @rem limitations under the License.
@REM @rem
@REM @rem SPDX-License-Identifier: Apache-2.0
@REM @rem

@REM @if "%DEBUG%" == "" @echo off
@REM @rem ##########################################################################
@REM @rem
@REM @rem  Gradle startup script for Windows
@REM @rem
@REM @rem ##########################################################################

@REM @rem Set local scope for the variables with windows NT shell
@REM if "%OS%"=="Windows_NT" setlocal

@REM set DIRNAME=%~dp0
@REM if "%DIRNAME%" == "" set DIRNAME=.
@REM set APP_BASE_NAME=%~n0
@REM set APP_HOME=%DIRNAME%

@REM @rem Resolve any "." and ".." in APP_HOME to make it shorter.
@REM for %%i in ("%APP_HOME%") do set APP_HOME=%%~fi

@REM @rem Add default JVM options here. You can also use JAVA_OPTS and GRADLE_OPTS to pass JVM options to this script.
@REM set DEFAULT_JVM_OPTS="-Xmx64m" "-Xms64m"

@REM @rem Find java.exe
@REM if defined JAVA_HOME goto findJavaFromJavaHome

@REM set JAVA_EXE=java.exe
@REM %JAVA_EXE% -version >NUL 2>&1
@REM if "%ERRORLEVEL%" == "0" goto execute

@REM echo. 1>&2
@REM echo ERROR: JAVA_HOME is not set and no 'java' command could be found in your PATH. 1>&2
@REM echo. 1>&2
@REM echo Please set the JAVA_HOME variable in your environment to match the 1>&2
@REM echo location of your Java installation. 1>&2

@REM goto fail

@REM :findJavaFromJavaHome
@REM set JAVA_HOME=%JAVA_HOME:"=%
@REM set JAVA_EXE=%JAVA_HOME%/bin/java.exe

@REM if exist "%JAVA_EXE%" goto execute

@REM echo. 1>&2
@REM echo ERROR: JAVA_HOME is set to an invalid directory: %JAVA_HOME% 1>&2
@REM echo. 1>&2
@REM echo Please set the JAVA_HOME variable in your environment to match the 1>&2
@REM echo location of your Java installation. 1>&2

@REM goto fail

@REM :execute
@REM @rem Setup the command line

@REM set CLASSPATH=%APP_HOME%\gradle\wrapper\gradle-wrapper.jar


@REM @rem Execute Gradle
@REM "%JAVA_EXE%" %DEFAULT_JVM_OPTS% %JAVA_OPTS% %GRADLE_OPTS% "-Dorg.gradle.appname=%APP_BASE_NAME%" -classpath "%CLASSPATH%" org.gradle.wrapper.GradleWrapperMain %*

@REM :end
@REM @rem End local scope for the variables with windows NT shell
@REM if "%ERRORLEVEL%"=="0" goto mainEnd

@REM :fail
@REM rem Set variable GRADLE_EXIT_CONSOLE if you need the _script_ return code instead of
@REM rem the _cmd.exe /c_ return code!
@REM if  not "" == "%GRADLE_EXIT_CONSOLE%" exit 1
@REM exit /b 1

@REM :mainEnd
@REM if "%OS%"=="Windows_NT" endlocal

@REM :omega





@rem
@rem Copyright 2015 the original author or authors.
@rem
@rem Licensed under the Apache License, Version 2.0 (the "License");
@rem you may not use this file except in compliance with the License.
@rem You may obtain a copy of the License at
@rem
@rem      https://www.apache.org/licenses/LICENSE-2.0
@rem
@rem Unless required by applicable law or agreed to in writing, software
@rem distributed under the License is distributed on an "AS IS" BASIS,
@rem WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
@rem See the License for the specific language governing permissions and
@rem limitations under the License.
@rem
@rem SPDX-License-Identifier: Apache-2.0
@rem

@if "%DEBUG%"=="" @echo off
@rem ##########################################################################
@rem
@rem  Gradle startup script for Windows
@rem
@rem ##########################################################################

@rem Set local scope for the variables with windows NT shell
if "%OS%"=="Windows_NT" setlocal

set DIRNAME=%~dp0
if "%DIRNAME%"=="" set DIRNAME=.
@rem This is normally unused
set APP_BASE_NAME=%~n0
set APP_HOME=%DIRNAME%

@rem Resolve any "." and ".." in APP_HOME to make it shorter.
for %%i in ("%APP_HOME%") do set APP_HOME=%%~fi

@rem Add default JVM options here. You can also use JAVA_OPTS and GRADLE_OPTS to pass JVM options to this script.
set DEFAULT_JVM_OPTS="-Xmx64m" "-Xms64m"

@rem Find java.exe
if defined JAVA_HOME goto findJavaFromJavaHome

set JAVA_EXE=java.exe
%JAVA_EXE% -version >NUL 2>&1
if %ERRORLEVEL% equ 0 goto execute

echo. 1>&2
echo ERROR: JAVA_HOME is not set and no 'java' command could be found in your PATH. 1>&2
echo. 1>&2
echo Please set the JAVA_HOME variable in your environment to match the 1>&2
echo location of your Java installation. 1>&2

goto fail

:findJavaFromJavaHome
set JAVA_HOME=%JAVA_HOME:"=%
set JAVA_EXE=%JAVA_HOME%/bin/java.exe

if exist "%JAVA_EXE%" goto execute

echo. 1>&2
echo ERROR: JAVA_HOME is set to an invalid directory: %JAVA_HOME% 1>&2
echo. 1>&2
echo Please set the JAVA_HOME variable in your environment to match the 1>&2
echo location of your Java installation. 1>&2

goto fail

:execute
@rem Setup the command line

set CLASSPATH=%APP_HOME%\gradle\wrapper\gradle-wrapper.jar


@rem Execute Gradle
"%JAVA_EXE%" %DEFAULT_JVM_OPTS% %JAVA_OPTS% %GRADLE_OPTS% "-Dorg.gradle.appname=%APP_BASE_NAME%" -classpath "%CLASSPATH%" org.gradle.wrapper.GradleWrapperMain %*

:end
@rem End local scope for the variables with windows NT shell
if %ERRORLEVEL% equ 0 goto mainEnd

:fail
rem Set variable GRADLE_EXIT_CONSOLE if you need the _script_ return code instead of
rem the _cmd.exe /c_ return code!
set EXIT_CODE=%ERRORLEVEL%
if %EXIT_CODE% equ 0 set EXIT_CODE=1
if not ""=="%GRADLE_EXIT_CONSOLE%" exit %EXIT_CODE%
exit /b %EXIT_CODE%

:mainEnd
if "%OS%"=="Windows_NT" endlocal

:omega