package org.apache.hadoop.examples;

import org.apache.hadoop.util.ProgramDriver;

public class Test {
	  public static void main(String argv[]){
		    int exitCode = -1;
		    ProgramDriver pgd = new ProgramDriver();
		    try {
		      pgd.addClass("vcpucount", VCPUCount.class, "Checking results of vcpu");
		      exitCode = pgd.run(argv);
		    }
		    catch(Throwable e){
		      e.printStackTrace();
		    }
		    
		    System.exit(exitCode);
		  }
}
