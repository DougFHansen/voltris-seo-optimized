@echo off
"C:\Program Files\dotnet\dotnet.exe" build VoltrisOptimizer.csproj -c Release > build_output.txt 2>&1
echo EXITCODE=%ERRORLEVEL% >> build_output.txt
