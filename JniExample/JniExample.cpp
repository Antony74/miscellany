#include "JniExample.h"
#include <string.h>
 
JNIEXPORT jstring JNICALL Java_JniExample_doSomething
   (JNIEnv *env, jobject obj, jstring string)
{
     const char* pString = env->GetStringUTFChars(string, 0);
     char szBuffer[64];
	 sprintf(szBuffer, "JniExample: String contains %d characters :-)", strlen(pString));
     env->ReleaseStringUTFChars(string, pString);
     return env->NewStringUTF(szBuffer);
 }
 
