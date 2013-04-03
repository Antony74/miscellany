
public class JniExample
{
  public native String doSomething(String text);
 
  public static void main(String[] args)
  {
     System.load(System.getProperty("user.dir") + "/JniExample.so");
     JniExample jniExample = new JniExample();
     String s = jniExample.doSomething("Hello World");

     System.out.println(s);
   }
}

