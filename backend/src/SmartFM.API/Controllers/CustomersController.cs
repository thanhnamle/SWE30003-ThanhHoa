using Microsoft.AspNetCore.Mvc;
using SmartFM.Domain.Entities;
using SmartFM.Domain.Interfaces;

namespace SmartFM.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CustomersController : ControllerBase
{
    private readonly IRepository<Customer> _customerRepository;

    public CustomersController(IRepository<Customer> customerRepository)
    {
        _customerRepository = customerRepository;
    }

    /// <summary>GET /api/customers</summary>
    [HttpGet]
    public async Task<IActionResult> GetCustomers()
    {
        var customers = await _customerRepository.GetAllAsync();
        var result = customers.Select(c => new
        {
            c.Id,
            c.Name,
            c.CompanyName,
            c.Email,
            c.Phone,
            c.IsCorporateAccount
        });
        return Ok(result);
    }

    /// <summary>GET /api/customers/{id}</summary>
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetCustomer(Guid id)
    {
        var customer = await _customerRepository.GetByIdAsync(id);
        if (customer == null) return NotFound(new { message = "Customer not found." });
        return Ok(new
        {
            customer.Id,
            customer.Name,
            customer.CompanyName,
            customer.Email,
            customer.Phone,
            customer.IsCorporateAccount
        });
    }

    /// <summary>POST /api/customers</summary>
    [HttpPost]
    public async Task<IActionResult> CreateCustomer([FromBody] CreateCustomerRequest request)
    {
        var customer = new Customer
        {
            Id = Guid.NewGuid(),
            Name = request.Name,
            CompanyName = request.CompanyName,
            Email = request.Email,
            Phone = request.Phone,
            IsCorporateAccount = request.IsCorporateAccount,
            CreatedAt = DateTime.UtcNow
        };
        await _customerRepository.AddAsync(customer);
        return CreatedAtAction(nameof(GetCustomer), new { id = customer.Id }, customer);
    }

    /// <summary>PUT /api/customers/{id}</summary>
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdateCustomer(Guid id, [FromBody] UpdateCustomerRequest request)
    {
        var customer = await _customerRepository.GetByIdAsync(id);
        if (customer == null) return NotFound(new { message = "Customer not found." });

        customer.Name = request.Name;
        customer.CompanyName = request.CompanyName;
        customer.Email = request.Email;
        customer.Phone = request.Phone;
        customer.IsCorporateAccount = request.IsCorporateAccount;

        await _customerRepository.UpdateAsync(customer);
        return Ok(customer);
    }

    /// <summary>DELETE /api/customers/{id}</summary>
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteCustomer(Guid id)
    {
        var customer = await _customerRepository.GetByIdAsync(id);
        if (customer == null) return NotFound(new { message = "Customer not found." });

        await _customerRepository.DeleteAsync(id);
        return NoContent();
    }
}

public record CreateCustomerRequest(string Name, string CompanyName, string Email, string Phone, bool IsCorporateAccount);
public record UpdateCustomerRequest(string Name, string CompanyName, string Email, string Phone, bool IsCorporateAccount);
