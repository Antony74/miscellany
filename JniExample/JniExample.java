
public class JniExample
{
  public native String doSomething(String text);
 
  public static void main(String[] args)
  {
     System.loadLibrary("JniExample");
     JniExample jniExample = new JniExample();
     String s = jniExample.doSomething("Hello World");

     System.out.println(s);
   }
}

